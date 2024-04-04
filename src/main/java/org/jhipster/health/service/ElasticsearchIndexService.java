package org.jhipster.health.service;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;
import javax.persistence.ManyToMany;
import org.elasticsearch.ResourceAlreadyExistsException;
import org.jhipster.health.config.ApplicationProperties;
import org.jhipster.health.domain.*;
import org.jhipster.health.repository.*;
import org.jhipster.health.repository.search.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ElasticsearchIndexService implements ApplicationListener<ContextRefreshedEvent> {

    private static final Lock reindexLock = new ReentrantLock();

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final PointsRepository pointsRepository;

    private final PointsSearchRepository pointsSearchRepository;

    private final WeightRepository weightRepository;

    private final WeightSearchRepository weightSearchRepository;

    private final BloodPressureRepository bloodPressureRepository;

    private final BloodPressureSearchRepository bloodPressureSearchRepository;

    private final PreferencesRepository preferencesRepository;

    private final PreferencesSearchRepository preferencesSearchRepository;

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final ElasticsearchOperations elasticsearchOperations;

    private final ApplicationProperties applicationProperties;

    private boolean reindex_elasticsearch;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        PointsRepository pointsRepository,
        PointsSearchRepository pointsSearchRepository,
        WeightRepository weightRepository,
        WeightSearchRepository weightSearchRepository,
        BloodPressureRepository bloodPressureRepository,
        BloodPressureSearchRepository bloodPressureSearchRepository,
        PreferencesRepository preferencesRepository,
        PreferencesSearchRepository preferencesSearchRepository,
        ElasticsearchOperations elasticsearchOperations,
        ApplicationProperties applicationProperties
    ) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.pointsRepository = pointsRepository;
        this.pointsSearchRepository = pointsSearchRepository;
        this.weightRepository = weightRepository;
        this.weightSearchRepository = weightSearchRepository;
        this.bloodPressureRepository = bloodPressureRepository;
        this.bloodPressureSearchRepository = bloodPressureSearchRepository;
        this.preferencesRepository = preferencesRepository;
        this.preferencesSearchRepository = preferencesSearchRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.applicationProperties = applicationProperties;
    }

    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        this.reindex_elasticsearch = applicationProperties.getElasticsearch().getReindexOnStartup();
        if (this.reindex_elasticsearch) {
            log.info("Reindexing all entities with Elasticsearch...");
            this.reindexSelected(null, true);
        } else {
            log.info(
                "Skipping Elasticsearch reindex. You may reindex all entities with Elasticsearch on start up by setting application.elasticsearch.reindex-on-startup to true."
            );
        }
    }

    @Async
    @Timed
    public void reindexSelected(List<String> classesForReindex, boolean all) {
        if (reindexLock.tryLock()) {
            try {
                if (all || classesForReindex.contains("Points")) {
                    reindexForClass(Points.class, pointsRepository, pointsSearchRepository);
                }
                if (all || classesForReindex.contains("Weight")) {
                    reindexForClass(Weight.class, weightRepository, weightSearchRepository);
                }
                if (all || classesForReindex.contains("BloodPressure")) {
                    reindexForClass(BloodPressure.class, bloodPressureRepository, bloodPressureSearchRepository);
                }
                if (all || classesForReindex.contains("Preferences")) {
                    reindexForClass(Preferences.class, preferencesRepository, preferencesSearchRepository);
                }
                if (all || classesForReindex.contains("User")) {
                    reindexForClass(User.class, userRepository, userSearchRepository);
                }

                log.info("Elasticsearch: Successfully performed reindexing");
            } finally {
                reindexLock.unlock();
            }
        } else {
            log.info("Elasticsearch: concurrent reindexing attempt");
        }
    }

    @SuppressWarnings("unchecked")
    private <T, ID extends Serializable> void reindexForClass(
        Class<T> entityClass,
        JpaRepository<T, ID> jpaRepository,
        ElasticsearchRepository<T, ID> elasticsearchRepository
    ) {
        String className = entityClass.getSimpleName();
        elasticsearchOperations.indexOps(entityClass).delete();
        try {
            elasticsearchOperations.indexOps(entityClass).createWithMapping();
        } catch (ResourceAlreadyExistsException e) {
            // Do nothing. Index was already concurrently recreated by some other service.
        }
        if (jpaRepository.count() > 0) {
            // if a JHipster entity field is the owner side of a many-to-many relationship, it should be loaded manually
            List<Method> relationshipGetters = Arrays.stream(entityClass.getDeclaredFields())
                .filter(field -> field.getType().equals(Set.class))
                .filter(field -> field.getAnnotation(ManyToMany.class) != null)
                .filter(field -> field.getAnnotation(ManyToMany.class).mappedBy().isEmpty())
                .filter(field -> field.getAnnotation(JsonIgnore.class) == null)
                .map(field -> {
                    try {
                        return new PropertyDescriptor(field.getName(), entityClass).getReadMethod();
                    } catch (IntrospectionException e) {
                        log.error(
                            "Error retrieving getter for class {}, field {}. Field will NOT be indexed",
                            className,
                            field.getName(),
                            e
                        );
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            int size = 100;
            for (int i = 0; i <= jpaRepository.count() / size; i++) {
                Pageable page = PageRequest.of(i, size);
                log.info("Indexing {} page {} of {}, size {}", className, i, jpaRepository.count() / size, size);
                Page<T> results = jpaRepository.findAll(page);
                results.map(result -> {
                    // if there are any relationships to load, do it now
                    relationshipGetters.forEach(method -> {
                        try {
                            // eagerly load the relationship set
                            ((Set) method.invoke(result)).size();
                        } catch (Exception ex) {
                            log.error(ex.getMessage());
                        }
                    });
                    return result;
                });
                elasticsearchRepository.saveAll(results.getContent());
            }
        }
        log.info("Elasticsearch: Indexed all rows for {}", className);
    }
}

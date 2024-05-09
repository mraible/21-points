package org.jhipster.health.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import java.util.List;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link BloodPressure} entity.
 */
public interface BloodPressureSearchRepository
    extends ElasticsearchRepository<BloodPressure, Long>, BloodPressureSearchRepositoryInternal {}

interface BloodPressureSearchRepositoryInternal {
    Page<BloodPressure> search(String query, Pageable pageable);

    Page<BloodPressure> search(Query query);

    @Async
    void index(BloodPressure entity);

    @Async
    void deleteFromIndexById(Long id);
}

class BloodPressureSearchRepositoryInternalImpl implements BloodPressureSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final BloodPressureRepository repository;

    BloodPressureSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, BloodPressureRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Page<BloodPressure> search(String query, Pageable pageable) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery.setPageable(pageable));
    }

    @Override
    public Page<BloodPressure> search(Query query) {
        SearchHits<BloodPressure> searchHits = elasticsearchTemplate.search(query, BloodPressure.class);
        List<BloodPressure> hits = searchHits.map(SearchHit::getContent).stream().toList();
        return new PageImpl<>(hits, query.getPageable(), searchHits.getTotalHits());
    }

    @Override
    public void index(BloodPressure entity) {
        repository.findOneWithEagerRelationships(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), BloodPressure.class);
    }
}

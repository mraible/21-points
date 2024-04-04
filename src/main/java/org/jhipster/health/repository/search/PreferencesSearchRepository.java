package org.jhipster.health.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import java.util.stream.Stream;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.repository.PreferencesRepository;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link Preferences} entity.
 */
public interface PreferencesSearchRepository extends ElasticsearchRepository<Preferences, Long>, PreferencesSearchRepositoryInternal {}

interface PreferencesSearchRepositoryInternal {
    Stream<Preferences> search(String query);

    Stream<Preferences> search(Query query);

    @Async
    void index(Preferences entity);

    @Async
    void deleteFromIndexById(Long id);
}

class PreferencesSearchRepositoryInternalImpl implements PreferencesSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final PreferencesRepository repository;

    PreferencesSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, PreferencesRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Preferences> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<Preferences> search(Query query) {
        return elasticsearchTemplate.search(query, Preferences.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Preferences entity) {
        repository.findOneWithEagerRelationships(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Preferences.class);
    }
}

package org.jhipster.health.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.stream.Stream;
import org.elasticsearch.index.query.QueryBuilder;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.repository.PreferencesRepository;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Preferences} entity.
 */
public interface PreferencesSearchRepository extends ElasticsearchRepository<Preferences, Long>, PreferencesSearchRepositoryInternal {}

interface PreferencesSearchRepositoryInternal {
    Stream<Preferences> search(String query);

    Stream<Preferences> search(Query query);

    Stream<Preferences> search(QueryBuilder query);

    void index(Preferences entity);
}

class PreferencesSearchRepositoryInternalImpl implements PreferencesSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;
    private final PreferencesRepository repository;

    PreferencesSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate, PreferencesRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Preferences> search(String query) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        return search(nativeSearchQuery);
    }

    @Override
    public Stream<Preferences> search(QueryBuilder query) {
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query).build();
        return search(searchQuery);
    }

    @Override
    public Stream<Preferences> search(Query query) {
        return elasticsearchTemplate.search(query, Preferences.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Preferences entity) {
        repository.findOneWithEagerRelationships(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }
}

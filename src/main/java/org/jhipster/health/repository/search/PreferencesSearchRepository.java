package org.jhipster.health.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.stream.Stream;
import org.jhipster.health.domain.Preferences;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Preferences} entity.
 */
public interface PreferencesSearchRepository extends ElasticsearchRepository<Preferences, Long>, PreferencesSearchRepositoryInternal {}

interface PreferencesSearchRepositoryInternal {
    Stream<Preferences> search(String query);
}

class PreferencesSearchRepositoryInternalImpl implements PreferencesSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    PreferencesSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Stream<Preferences> search(String query) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        return elasticsearchTemplate.search(nativeSearchQuery, Preferences.class).map(SearchHit::getContent).stream();
    }
}

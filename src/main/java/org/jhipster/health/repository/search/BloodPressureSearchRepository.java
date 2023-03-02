package org.jhipster.health.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.List;
import java.util.stream.Collectors;
import org.elasticsearch.index.query.QueryBuilder;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link BloodPressure} entity.
 */
public interface BloodPressureSearchRepository
    extends ElasticsearchRepository<BloodPressure, Long>, BloodPressureSearchRepositoryInternal {}

interface BloodPressureSearchRepositoryInternal {
    Page<BloodPressure> search(String query, Pageable pageable);

    Page<BloodPressure> search(QueryBuilder query, Pageable pageable);

    Page<BloodPressure> search(Query query);

    void index(BloodPressure entity);
}

class BloodPressureSearchRepositoryInternalImpl implements BloodPressureSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;
    private final BloodPressureRepository repository;

    BloodPressureSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate, BloodPressureRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Page<BloodPressure> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        return search(nativeSearchQuery.setPageable(pageable));
    }

    @Override
    public Page<BloodPressure> search(QueryBuilder query, Pageable pageable) {
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query).withPageable(pageable).build();
        return search(searchQuery);
    }

    @Override
    public Page<BloodPressure> search(Query query) {
        SearchHits<BloodPressure> searchHits = elasticsearchTemplate.search(query, BloodPressure.class);
        List<BloodPressure> hits = searchHits.map(SearchHit::getContent).stream().collect(Collectors.toList());
        return new PageImpl<>(hits, query.getPageable(), searchHits.getTotalHits());
    }

    @Override
    public void index(BloodPressure entity) {
        repository.findOneWithEagerRelationships(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }
}

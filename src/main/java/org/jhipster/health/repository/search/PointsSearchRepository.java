package org.jhipster.health.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.List;
import java.util.stream.Collectors;
import org.elasticsearch.index.query.QueryBuilder;
import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
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
 * Spring Data Elasticsearch repository for the {@link Points} entity.
 */
public interface PointsSearchRepository extends ElasticsearchRepository<Points, Long>, PointsSearchRepositoryInternal {}

interface PointsSearchRepositoryInternal {
    Page<Points> search(String query, Pageable pageable);

    Page<Points> search(QueryBuilder query, Pageable pageable);

    Page<Points> search(Query query);

    void index(Points entity);
}

class PointsSearchRepositoryInternalImpl implements PointsSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;
    private final PointsRepository repository;

    PointsSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate, PointsRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Page<Points> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        return search(nativeSearchQuery.setPageable(pageable));
    }

    @Override
    public Page<Points> search(QueryBuilder query, Pageable pageable) {
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query).withPageable(pageable).build();
        return search(searchQuery);
    }

    @Override
    public Page<Points> search(Query query) {
        SearchHits<Points> searchHits = elasticsearchTemplate.search(query, Points.class);
        List<Points> hits = searchHits.map(SearchHit::getContent).stream().collect(Collectors.toList());
        return new PageImpl<>(hits, query.getPageable(), searchHits.getTotalHits());
    }

    @Override
    public void index(Points entity) {
        repository.findOneWithEagerRelationships(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }
}

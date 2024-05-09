package org.jhipster.health.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import java.util.List;
import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
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
 * Spring Data Elasticsearch repository for the {@link Points} entity.
 */
public interface PointsSearchRepository extends ElasticsearchRepository<Points, Long>, PointsSearchRepositoryInternal {
    Page<Points> findByUserLogin(String username, Pageable pageable);
}

interface PointsSearchRepositoryInternal {
    Page<Points> search(String query, Pageable pageable);

    Page<Points> search(Query query);

    @Async
    void index(Points entity);

    @Async
    void deleteFromIndexById(Long id);
}

class PointsSearchRepositoryInternalImpl implements PointsSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final PointsRepository repository;

    PointsSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, PointsRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Page<Points> search(String query, Pageable pageable) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery.setPageable(pageable));
    }

    @Override
    public Page<Points> search(Query query) {
        SearchHits<Points> searchHits = elasticsearchTemplate.search(query, Points.class);
        List<Points> hits = searchHits.map(SearchHit::getContent).stream().toList();
        return new PageImpl<>(hits, query.getPageable(), searchHits.getTotalHits());
    }

    @Override
    public void index(Points entity) {
        repository.findOneWithEagerRelationships(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Points.class);
    }
}

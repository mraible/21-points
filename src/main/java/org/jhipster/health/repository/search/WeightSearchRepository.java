package org.jhipster.health.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import java.util.List;
import org.jhipster.health.domain.Weight;
import org.jhipster.health.repository.WeightRepository;
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
 * Spring Data Elasticsearch repository for the {@link Weight} entity.
 */
public interface WeightSearchRepository extends ElasticsearchRepository<Weight, Long>, WeightSearchRepositoryInternal {}

interface WeightSearchRepositoryInternal {
    Page<Weight> search(String query, Pageable pageable);

    Page<Weight> search(Query query);

    @Async
    void index(Weight entity);

    @Async
    void deleteFromIndexById(Long id);
}

class WeightSearchRepositoryInternalImpl implements WeightSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final WeightRepository repository;

    WeightSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, WeightRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Page<Weight> search(String query, Pageable pageable) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery.setPageable(pageable));
    }

    @Override
    public Page<Weight> search(Query query) {
        SearchHits<Weight> searchHits = elasticsearchTemplate.search(query, Weight.class);
        List<Weight> hits = searchHits.map(SearchHit::getContent).stream().toList();
        return new PageImpl<>(hits, query.getPageable(), searchHits.getTotalHits());
    }

    @Override
    public void index(Weight entity) {
        repository.findOneWithEagerRelationships(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Weight.class);
    }
}

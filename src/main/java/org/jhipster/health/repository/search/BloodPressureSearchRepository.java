package org.jhipster.health.repository.search;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.jhipster.health.domain.BloodPressure;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link BloodPressure} entity.
 */
public interface BloodPressureSearchRepository
    extends ElasticsearchRepository<BloodPressure, Long>, BloodPressureSearchRepositoryInternal {}

interface BloodPressureSearchRepositoryInternal {
    Page<BloodPressure> search(String query, Pageable pageable);
}

class BloodPressureSearchRepositoryInternalImpl implements BloodPressureSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    BloodPressureSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<BloodPressure> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<BloodPressure> hits = elasticsearchTemplate
            .search(nativeSearchQuery, BloodPressure.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}

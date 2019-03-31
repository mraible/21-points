package org.jhipster.health.repository.search;

import org.jhipster.health.domain.Weight;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.UUID;

/**
 * Spring Data Elasticsearch repository for the Weight entity.
 */
public interface WeightSearchRepository extends ElasticsearchRepository<Weight, UUID> {
}

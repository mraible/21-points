package org.jhipster.health.repository.search;

import org.jhipster.health.domain.Metric;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Metric entity.
 */
public interface MetricSearchRepository extends ElasticsearchRepository<Metric, Long> {
}

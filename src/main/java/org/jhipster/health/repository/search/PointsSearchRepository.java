package org.jhipster.health.repository.search;

import org.jhipster.health.domain.Points;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Points entity.
 */
public interface PointsSearchRepository extends ElasticsearchRepository<Points, Long> {
}

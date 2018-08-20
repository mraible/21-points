package org.jhipster.health.repository.search;

import org.jhipster.health.domain.BloodPressure;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the BloodPressure entity.
 */
public interface BloodPressureSearchRepository extends ElasticsearchRepository<BloodPressure, Long> {
}

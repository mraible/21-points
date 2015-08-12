package org.jhipster.health.repository.search;

import org.jhipster.health.domain.Goal;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Goal entity.
 */
public interface GoalSearchRepository extends ElasticsearchRepository<Goal, Long> {
}

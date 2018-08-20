package org.jhipster.health.repository.search;

import org.jhipster.health.domain.Preferences;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Preferences entity.
 */
public interface PreferencesSearchRepository extends ElasticsearchRepository<Preferences, Long> {
}

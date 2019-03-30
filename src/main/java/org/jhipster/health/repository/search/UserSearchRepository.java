package org.jhipster.health.repository.search;

import org.jhipster.health.domain.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.UUID;

/**
 * Spring Data Elasticsearch repository for the User entity.
 */
public interface UserSearchRepository extends ElasticsearchRepository<User, UUID> {
}

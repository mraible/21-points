package org.jhipster.health.repository;

import org.jhipster.health.domain.Preferences;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Preferences entity.
 */
public interface PreferencesRepository extends JpaRepository<Preferences,Long> {

}

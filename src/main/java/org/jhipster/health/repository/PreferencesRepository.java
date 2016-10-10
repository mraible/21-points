package org.jhipster.health.repository;

import org.jhipster.health.domain.Preferences;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data JPA repository for the Preferences entity.
 */
@SuppressWarnings("unused")
public interface PreferencesRepository extends JpaRepository<Preferences,Long> {

    Optional<Preferences> findOneByUserLogin(String login);

}

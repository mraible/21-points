package org.jhipster.health.repository;

import org.jhipster.health.domain.Preferences;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.Optional;


/**
 * Spring Data JPA repository for the Preferences entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PreferencesRepository extends JpaRepository<Preferences,Long> {

    Optional<Preferences> findOneByUserLogin(String login);

}

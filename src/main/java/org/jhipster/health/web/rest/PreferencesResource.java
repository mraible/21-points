package org.jhipster.health.web.rest;

import io.micrometer.core.annotation.Timed;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.domain.User;
import org.jhipster.health.repository.PreferencesRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PreferencesSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jhipster.health.domain.Preferences}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PreferencesResource {

    private final Logger log = LoggerFactory.getLogger(PreferencesResource.class);

    private static final String ENTITY_NAME = "preferences";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PreferencesRepository preferencesRepository;

    private final PreferencesSearchRepository preferencesSearchRepository;

    private final UserRepository userRepository;

    public PreferencesResource(
        PreferencesRepository preferencesRepository,
        PreferencesSearchRepository preferencesSearchRepository,
        UserRepository userRepository
    ) {
        this.preferencesRepository = preferencesRepository;
        this.preferencesSearchRepository = preferencesSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /preferences} : Create a new preferences.
     *
     * @param preferences the preferences to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new preferences, or with status {@code 400 (Bad Request)} if the preferences has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/preferences")
    public ResponseEntity<Preferences> createPreferences(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to save Preferences : {}", preferences);
        if (preferences.getId() != null) {
            throw new BadRequestAlertException("A new preferences cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, setting preferences for current user: {}", SecurityUtils.getCurrentUserLogin().orElse(""));
            preferences.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse("")).orElse(null));
        }

        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.index(result);
        return ResponseEntity
            .created(new URI("/api/preferences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /preferences/:id} : Updates an existing preferences.
     *
     * @param id the id of the preferences to save.
     * @param preferences the preferences to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated preferences,
     * or with status {@code 400 (Bad Request)} if the preferences is not valid,
     * or with status {@code 500 (Internal Server Error)} if the preferences couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/preferences/{id}")
    public ResponseEntity<Preferences> updatePreferences(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Preferences preferences
    ) throws URISyntaxException {
        log.debug("REST request to update Preferences : {}, {}", id, preferences);
        if (preferences.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, preferences.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!preferencesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.index(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, preferences.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /preferences/:id} : Partial updates given fields of an existing preferences, field will ignore if it is null
     *
     * @param id the id of the preferences to save.
     * @param preferences the preferences to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated preferences,
     * or with status {@code 400 (Bad Request)} if the preferences is not valid,
     * or with status {@code 404 (Not Found)} if the preferences is not found,
     * or with status {@code 500 (Internal Server Error)} if the preferences couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/preferences/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Preferences> partialUpdatePreferences(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Preferences preferences
    ) throws URISyntaxException {
        log.debug("REST request to partial update Preferences partially : {}, {}", id, preferences);
        if (preferences.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, preferences.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!preferencesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Preferences> result = preferencesRepository
            .findById(preferences.getId())
            .map(existingPreferences -> {
                if (preferences.getWeeklyGoal() != null) {
                    existingPreferences.setWeeklyGoal(preferences.getWeeklyGoal());
                }
                if (preferences.getWeightUnits() != null) {
                    existingPreferences.setWeightUnits(preferences.getWeightUnits());
                }

                return existingPreferences;
            })
            .map(preferencesRepository::save)
            .map(savedPreferences -> {
                preferencesSearchRepository.save(savedPreferences);

                return savedPreferences;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, preferences.getId().toString())
        );
    }

    /**
     * {@code GET  /preferences} : get all the preferences.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of preferences in body.
     */
    @GetMapping("/preferences")
    public List<Preferences> getAllPreferences(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Preferences");
        List<Preferences> preferences = new ArrayList<>();
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            preferences = preferencesRepository.findAll();
        } else {
            Preferences userPreferences = getUserPreferences().getBody();
            // don't return default value of 10 points in this method
            if (userPreferences.getId() != null) {
                preferences.add(userPreferences);
            }
        }
        return preferences;
    }

    /**
     * {@code GET  /preferences/:id} : get the "id" preferences.
     *
     * @param id the id of the preferences to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the preferences, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/preferences/{id}")
    public ResponseEntity<Preferences> getPreferences(@PathVariable Long id) {
        log.debug("REST request to get Preferences : {}", id);
        Optional<Preferences> preferences = preferencesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(preferences);
    }

    /**
     * {@code DELETE  /preferences/:id} : delete the "id" preferences.
     *
     * @param id the id of the preferences to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/preferences/{id}")
    public ResponseEntity<Void> deletePreferences(@PathVariable Long id) {
        log.debug("REST request to delete Preferences : {}", id);
        preferencesRepository.deleteById(id);
        preferencesSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/preferences?query=:query} : search for the preferences corresponding
     * to the query.
     *
     * @param query the query of the preferences search.
     * @return the result of the search.
     */
    @GetMapping("/_search/preferences")
    public List<Preferences> searchPreferences(@RequestParam String query) {
        log.debug("REST request to search Preferences for query {}", query);
        return StreamSupport.stream(preferencesSearchRepository.search(query).spliterator(), false).collect(Collectors.toList());
    }

    /**
     * {@code GET  /my-preferences} : get the current user's preferences
     *
     * @return the preferences or default (weeklyGoal: 10) if none exist.
     */
    @GetMapping("/my-preferences")
    @Timed
    public ResponseEntity<Preferences> getUserPreferences() {
        String username = SecurityUtils.getCurrentUserLogin().orElse("");
        log.debug("REST request to get Preferences : {}", username);
        Optional<Preferences> preferences = preferencesRepository.findOneByUserLogin(username);

        if (preferences.isPresent()) {
            return new ResponseEntity<>(preferences.get(), HttpStatus.OK);
        } else {
            Preferences defaultPreferences = new Preferences();
            defaultPreferences.setWeeklyGoal(10); // default
            return new ResponseEntity<>(defaultPreferences, HttpStatus.OK);
        }
    }
}

package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.domain.User;
import org.jhipster.health.repository.PreferencesRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PreferencesSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Preferences.
 */
@RestController
@RequestMapping("/api")
public class PreferencesResource {

    private final Logger log = LoggerFactory.getLogger(PreferencesResource.class);

    private static final String ENTITY_NAME = "preferences";

    private final PreferencesRepository preferencesRepository;

    private final PreferencesSearchRepository preferencesSearchRepository;

    private final UserRepository userRepository;

    public PreferencesResource(PreferencesRepository preferencesRepository, PreferencesSearchRepository preferencesSearchRepository, UserRepository userRepository) {
        this.preferencesRepository = preferencesRepository;
        this.preferencesSearchRepository = preferencesSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /preferences : Create a new preferences.
     *
     * @param preferences the preferences to create
     * @return the ResponseEntity with status 201 (Created) and with body the new preferences, or with status 400 (Bad Request) if the preferences has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/preferences")
    @Timed
    public ResponseEntity<?> createPreferences(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to save Preferences : {}", preferences);
        if (preferences.getId() != null) {
            throw new BadRequestAlertException("A new preferences cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (preferences.getUser() != null &&
            !preferences.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        log.debug("Settings preferences for current user: {}", SecurityUtils.getCurrentUserLogin());
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null);
        preferences.setUser(user);

        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/preferences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /preferences : Updates an existing preferences.
     *
     * @param preferences the preferences to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated preferences,
     * or with status 400 (Bad Request) if the preferences is not valid,
     * or with status 500 (Internal Server Error) if the preferences couldn't be updated
     */
    @PutMapping("/preferences")
    @Timed
    public ResponseEntity<?> updatePreferences(@Valid @RequestBody Preferences preferences) {
        log.debug("REST request to update Preferences : {}", preferences);
        if (preferences.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (preferences.getUser() != null &&
            !preferences.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, preferences.getId().toString()))
            .body(result);
    }

    /**
     * GET  /preferences : get all the preferences.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of preferences in body
     */
    @GetMapping("/preferences")
    @Timed
    public List<Preferences> getAllPreferences() {
        log.debug("REST request to get all Preferences");
        List<Preferences> preferences = new ArrayList<>();
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
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
     * GET  /my-preferences -> get the current user's preferences.
     */
    @GetMapping("/my-preferences")
    @Timed
    public ResponseEntity<Preferences> getUserPreferences() {
        String username = SecurityUtils.getCurrentUserLogin().orElse(null);
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

    /**
     * GET  /preferences/:id : get the "id" preferences.
     *
     * @param id the id of the preferences to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the preferences, or with status 404 (Not Found)
     */
    @GetMapping("/preferences/{id}")
    @Timed
    public ResponseEntity<?> getPreferences(@PathVariable Long id) {
        log.debug("REST request to get Preferences : {}", id);
        Optional<Preferences> preferences = preferencesRepository.findById(id);
        if (preferences.isPresent() && preferences.get().getUser() != null &&
            !preferences.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(preferences);
    }

    /**
     * DELETE  /preferences/:id : delete the "id" preferences.
     *
     * @param id the id of the preferences to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/preferences/{id}")
    @Timed
    public ResponseEntity<?> deletePreferences(@PathVariable Long id) {
        log.debug("REST request to delete Preferences : {}", id);
        Optional<Preferences> preferences = preferencesRepository.findById(id);
        if (preferences.isPresent() && preferences.get().getUser() != null &&
            !preferences.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        preferencesRepository.deleteById(id);
        preferencesSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/preferences?query=:query : search for the preferences corresponding
     * to the query.
     *
     * @param query the query of the preferences search
     * @return the result of the search
     */
    @GetMapping("/_search/preferences")
    @Timed
    public List<Preferences> searchPreferences(@RequestParam String query) {
        log.debug("REST request to search Preferences for query {}", query);
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().must(queryStringQuery(query));
        if (SecurityUtils.isAuthenticated() && !SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            queryBuilder = queryBuilder.filter(matchQuery("user.login",
                SecurityUtils.getCurrentUserLogin().orElse("")));
        }
        return StreamSupport
            .stream(preferencesSearchRepository.search(queryBuilder).spliterator(), false)
            .collect(Collectors.toList());
    }

}

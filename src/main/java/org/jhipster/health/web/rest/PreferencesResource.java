package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.domain.User;
import org.jhipster.health.repository.PreferencesRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PreferencesSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Preferences.
 */
@RestController
@RequestMapping("/api")
public class PreferencesResource {

    private final Logger log = LoggerFactory.getLogger(PreferencesResource.class);

    @Inject
    private PreferencesRepository preferencesRepository;

    @Inject
    private PreferencesSearchRepository preferencesSearchRepository;

    @Inject
    private UserRepository userRepository;

    /**
     * POST  /preferences : Create a new preferences.
     *
     * @param preferences the preferences to create
     * @return the ResponseEntity with status 201 (Created) and with body the new preferences, or with status 400 (Bad Request) if the preferences has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/preferences",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Preferences> createPreferences(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to save Preferences : {}", preferences);
        if (preferences.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("preferences", "idexists", "A new preferences cannot already have an ID")).body(null);
        }

        log.debug("Settings preferences for current user: {}", SecurityUtils.getCurrentUserLogin());
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        preferences.setUser(user);

        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.save(result);

        return ResponseEntity.created(new URI("/api/preferences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("preferences", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /preferences : Updates an existing preferences.
     *
     * @param preferences the preferences to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated preferences,
     * or with status 400 (Bad Request) if the preferences is not valid,
     * or with status 500 (Internal Server Error) if the preferences couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/preferences",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Preferences> updatePreferences(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to update Preferences : {}", preferences);
        if (preferences.getId() == null) {
            return createPreferences(preferences);
        }
        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("preferences", preferences.getId().toString()))
            .body(result);
    }

    /**
     * GET  /preferences : get all the preferences.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of preferences in body
     */
    @RequestMapping(value = "/preferences",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
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
    @RequestMapping(value = "/my-preferences",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Preferences> getUserPreferences() {
        String username = SecurityUtils.getCurrentUserLogin();
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
    @RequestMapping(value = "/preferences/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Preferences> getPreferences(@PathVariable Long id) {
        log.debug("REST request to get Preferences : {}", id);
        Preferences preferences = preferencesRepository.findOne(id);
        return Optional.ofNullable(preferences)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /preferences/:id : delete the "id" preferences.
     *
     * @param id the id of the preferences to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/preferences/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePreferences(@PathVariable Long id) {
        log.debug("REST request to delete Preferences : {}", id);
        preferencesRepository.delete(id);
        preferencesSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("preferences", id.toString())).build();
    }

    /**
     * SEARCH  /_search/preferences?query=:query : search for the preferences corresponding
     * to the query.
     *
     * @param query the query of the preferences search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/preferences",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Preferences> searchPreferences(@RequestParam String query) {
        log.debug("REST request to search Preferences for query {}", query);
        return StreamSupport
            .stream(preferencesSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}

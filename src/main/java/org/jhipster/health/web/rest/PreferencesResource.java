package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.repository.PreferencesRepository;
import org.jhipster.health.repository.search.PreferencesSearchRepository;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryString;

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

    /**
     * POST  /preferences -> Create a new preferences.
     */
    @RequestMapping(value = "/preferences",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Preferences> create(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to save Preferences : {}", preferences);
        if (preferences.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new preferences cannot already have an ID").body(null);
        }
        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/preferences/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("preferences", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /preferences -> Updates an existing preferences.
     */
    @RequestMapping(value = "/preferences",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Preferences> update(@Valid @RequestBody Preferences preferences) throws URISyntaxException {
        log.debug("REST request to update Preferences : {}", preferences);
        if (preferences.getId() == null) {
            return create(preferences);
        }
        Preferences result = preferencesRepository.save(preferences);
        preferencesSearchRepository.save(preferences);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("preferences", preferences.getId().toString()))
                .body(result);
    }

    /**
     * GET  /preferences -> get all the preferences.
     */
    @RequestMapping(value = "/preferences",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Preferences> getAll(@RequestParam(required = false) String filter) {
        if ("user-is-null".equals(filter)) {
            log.debug("REST request to get all Preferences where user is null");
            return StreamSupport
                .stream(preferencesRepository.findAll().spliterator(), false)
                .filter(preferences -> preferences.getUser() == null)
                .collect(Collectors.toList());
        }

        log.debug("REST request to get all Preferences");
        return preferencesRepository.findAll();
    }

    /**
     * GET  /preferences/:id -> get the "id" preferences.
     */
    @RequestMapping(value = "/preferences/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Preferences> get(@PathVariable Long id) {
        log.debug("REST request to get Preferences : {}", id);
        return Optional.ofNullable(preferencesRepository.findOne(id))
            .map(preferences -> new ResponseEntity<>(
                preferences,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /preferences/:id -> delete the "id" preferences.
     */
    @RequestMapping(value = "/preferences/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Preferences : {}", id);
        preferencesRepository.delete(id);
        preferencesSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("preferences", id.toString())).build();
    }

    /**
     * SEARCH  /_search/preferences/:query -> search for the preferences corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/preferences/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Preferences> search(@PathVariable String query) {
        return StreamSupport
            .stream(preferencesSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

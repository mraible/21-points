package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.Goal;
import org.jhipster.health.repository.GoalRepository;
import org.jhipster.health.repository.search.GoalSearchRepository;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
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

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Goal.
 */
@RestController
@RequestMapping("/api")
public class GoalResource {

    private final Logger log = LoggerFactory.getLogger(GoalResource.class);

    @Inject
    private GoalRepository goalRepository;

    @Inject
    private GoalSearchRepository goalSearchRepository;

    /**
     * POST  /goals -> Create a new goal.
     */
    @RequestMapping(value = "/goals",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Goal> create(@Valid @RequestBody Goal goal) throws URISyntaxException {
        log.debug("REST request to save Goal : {}", goal);
        if (goal.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new goal cannot already have an ID").body(null);
        }
        Goal result = goalRepository.save(goal);
        goalSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/goals/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("goal", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /goals -> Updates an existing goal.
     */
    @RequestMapping(value = "/goals",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Goal> update(@Valid @RequestBody Goal goal) throws URISyntaxException {
        log.debug("REST request to update Goal : {}", goal);
        if (goal.getId() == null) {
            return create(goal);
        }
        Goal result = goalRepository.save(goal);
        goalSearchRepository.save(goal);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("goal", goal.getId().toString()))
                .body(result);
    }

    /**
     * GET  /goals -> get all the goals.
     */
    @RequestMapping(value = "/goals",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Goal> getAll() {
        log.debug("REST request to get all Goals");
        return goalRepository.findAll();
    }

    /**
     * GET  /goals/:id -> get the "id" goal.
     */
    @RequestMapping(value = "/goals/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Goal> get(@PathVariable Long id) {
        log.debug("REST request to get Goal : {}", id);
        return Optional.ofNullable(goalRepository.findOne(id))
            .map(goal -> new ResponseEntity<>(
                goal,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /goals/:id -> delete the "id" goal.
     */
    @RequestMapping(value = "/goals/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Goal : {}", id);
        goalRepository.delete(id);
        goalSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("goal", id.toString())).build();
    }

    /**
     * SEARCH  /_search/goals/:query -> search for the goal corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/goals/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Goal> search(@PathVariable String query) {
        return StreamSupport
            .stream(goalSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

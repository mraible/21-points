package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PointsSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.joda.time.DateTimeConstants;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
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

import static org.elasticsearch.index.query.QueryBuilders.queryString;

/**
 * REST controller for managing Points.
 */
@RestController
@RequestMapping("/api")
public class PointsResource {

    private final Logger log = LoggerFactory.getLogger(PointsResource.class);

    @Inject
    private PointsRepository pointsRepository;

    @Inject
    private PointsSearchRepository pointsSearchRepository;

    @Inject
    private UserRepository userRepository;

    /**
     * POST  /points -> Create a new points.
     */
    @RequestMapping(value = "/points",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Points> create(@Valid @RequestBody Points points) throws URISyntaxException {
        log.debug("REST request to save Points : {}", points);
        if (points.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new points cannot already have an ID").body(null);
        }
        if (points.getUser() == null || points.getUser().getId() == null) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentLogin());
            points.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentLogin()).get());
        }
        Points result = pointsRepository.save(points);
        pointsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("points", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /points -> Updates an existing points.
     */
    @RequestMapping(value = "/points",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Points> update(@Valid @RequestBody Points points) throws URISyntaxException {
        log.debug("REST request to update Points : {}", points);
        if (points.getId() == null) {
            return create(points);
        }
        Points result = pointsRepository.save(points);
        pointsSearchRepository.save(points);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("points", points.getId().toString()))
            .body(result);
    }

    /**
     * GET  /points -> get all the points.
     */
    @RequestMapping(value = "/points",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Points>> getAll(@RequestParam(value = "page", required = false) Integer offset,
                                               @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<Points> page;
        if (SecurityUtils.isUserInRole(AuthoritiesConstants.ADMIN)) {
            page = pointsRepository.findAllByOrderByDateDesc(PaginationUtil.generatePageRequest(offset, limit));
        } else {
            page = pointsRepository.findAllForCurrentUser(PaginationUtil.generatePageRequest(offset, limit));
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/points", offset, limit);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /points -> get all the points for the current week.
     */
    @RequestMapping(value = "/points-this-week",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PointsPerWeek> getPointsThisWeek() {
        // todo: get timezone from user's browser
        DateTimeZone timeZone = DateTimeZone.forID("America/Denver");
        log.debug("Getting points for week with timezone: {}", timeZone);

        // Get current date
        LocalDate now = new LocalDate();
        // Get first day of week
        LocalDate startOfWeek = now.withDayOfWeek(DateTimeConstants.MONDAY);
        // Get last day of week
        LocalDate endOfWeek = now.withDayOfWeek(DateTimeConstants.SUNDAY);
        log.debug("Looking for points between: {} and {}", startOfWeek, endOfWeek);

        List<Points> points = pointsRepository.findAllByDateBetween(startOfWeek, endOfWeek);
        return calculatePoints(startOfWeek, points);
    }

    private ResponseEntity<PointsPerWeek> calculatePoints(LocalDate startOfWeek, List<Points> points) {
        Integer numPoints = points.stream()
            .filter(p -> p.getUser().getLogin().equals(SecurityUtils.getCurrentLogin()))
            .mapToInt(p -> p.getExercise() + p.getMeals() + p.getAlcohol())
            .sum();

        PointsPerWeek count = new PointsPerWeek(startOfWeek, numPoints);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    /**
     * GET  /points -> get all the points for a particular current week.
     */
    @RequestMapping(value = "/points-by-week/{startDate}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PointsPerWeek> getPointsByWeek(@PathVariable @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate startDate) {
        // Get last day of week
        LocalDate endOfWeek = startDate.withDayOfWeek(DateTimeConstants.SUNDAY);
        List<Points> points = pointsRepository.findAllByDateBetween(startDate, endOfWeek);
        return calculatePoints(startDate, points);
    }

    /**
     * GET  /points/:id -> get the "id" points.
     */
    @RequestMapping(value = "/points/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Points> get(@PathVariable Long id) {
        log.debug("REST request to get Points : {}", id);
        return Optional.ofNullable(pointsRepository.findOne(id))
            .map(points -> new ResponseEntity<>(
                points,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /points/:id -> delete the "id" points.
     */
    @RequestMapping(value = "/points/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.debug("REST request to delete Points : {}", id);
        pointsRepository.delete(id);
        pointsSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("points", id.toString())).build();
    }

    /**
     * SEARCH  /_search/points/:query -> search for the points corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/points/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Points> search(@PathVariable String query) {
        return StreamSupport
            .stream(pointsSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

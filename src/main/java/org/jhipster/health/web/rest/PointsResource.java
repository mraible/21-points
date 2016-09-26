package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PointsSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.vm.PointsPerMonth;
import org.jhipster.health.web.rest.vm.PointsPerWeek;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

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
     * POST  /points : Create a new points.
     *
     * @param points the points to create
     * @return the ResponseEntity with status 201 (Created) and with body the new points, or with status 400 (Bad Request) if the points has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/points",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Points> createPoints(@Valid @RequestBody Points points) throws URISyntaxException {
        log.debug("REST request to save Points : {}", points);
        if (points.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("points", "idexists", "A new points cannot already have an ID")).body(null);
        }
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            points.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
        }
        Points result = pointsRepository.save(points);
        pointsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("points", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /points : Updates an existing points.
     *
     * @param points the points to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated points,
     * or with status 400 (Bad Request) if the points is not valid,
     * or with status 500 (Internal Server Error) if the points couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/points",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Points> updatePoints(@Valid @RequestBody Points points) throws URISyntaxException {
        log.debug("REST request to update Points : {}", points);
        if (points.getId() == null) {
            return createPoints(points);
        }
        Points result = pointsRepository.save(points);
        pointsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("points", points.getId().toString()))
            .body(result);
    }

    /**
     * GET  /points : get all the points.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of points in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/points",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Points>> getAllPoints(Pageable pageable) throws URISyntaxException {
        log.debug("REST request to get a page of Points");
        Page<Points> page;
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            page = pointsRepository.findAllByOrderByDateDesc(pageable);
        } else {
            page = pointsRepository.findByUserIsCurrentUser(pageable);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/points");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /points : get all the points for the current week.
     */
    @RequestMapping(value = "/points-this-week")
    @Timed
    public ResponseEntity<PointsPerWeek> getPointsThisWeek() {
        // Get current date
        LocalDate now = LocalDate.now();
        // Get first day of week
        LocalDate startOfWeek = now.with(DayOfWeek.MONDAY);
        // Get last day of week
        LocalDate endOfWeek = now.with(DayOfWeek.SUNDAY);
        log.debug("Looking for points between: {} and {}", startOfWeek, endOfWeek);

        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(startOfWeek, endOfWeek, SecurityUtils.getCurrentUserLogin());
        return calculatePoints(startOfWeek, points);
    }

    private ResponseEntity<PointsPerWeek> calculatePoints(LocalDate startOfWeek, List<Points> points) {
        Integer numPoints = points.stream()
            .mapToInt(p -> p.getExercise() + p.getMeals() + p.getAlcohol())
            .sum();

        PointsPerWeek count = new PointsPerWeek(startOfWeek, numPoints);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    /**
     * GET  /points : get all the points for a particular week.
     */
    @RequestMapping(value = "/points-by-week/{startDate}")
    @Timed
    public ResponseEntity<PointsPerWeek> getPointsByWeek(@PathVariable @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate startDate) {
        // Get last day of week
        LocalDate endOfWeek = startDate.with(DayOfWeek.SUNDAY);
        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(startDate, endOfWeek, SecurityUtils.getCurrentUserLogin());
        return calculatePoints(startDate, points);
    }

    /**
     * GET  /points : get all the points for a particular current month.
     */
    @RequestMapping(value = "/points-by-month/{yearWithMonth}")
    @Timed
    public ResponseEntity<PointsPerMonth> getPointsByMonth(@PathVariable @DateTimeFormat(pattern="yyyy-MM") YearMonth yearWithMonth) {
        // Get last day of the month
        LocalDate endOfMonth = yearWithMonth.atEndOfMonth();
        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(yearWithMonth.atDay(1), endOfMonth, SecurityUtils.getCurrentUserLogin());
        PointsPerMonth pointsPerMonth = new PointsPerMonth(yearWithMonth, points);
        return new ResponseEntity<>(pointsPerMonth, HttpStatus.OK);
    }

    /**
     * GET  /points/:id : get the "id" points.
     *
     * @param id the id of the points to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the points, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/points/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Points> getPoints(@PathVariable Long id) {
        log.debug("REST request to get Points : {}", id);
        Points points = pointsRepository.findOne(id);
        return Optional.ofNullable(points)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /points/:id : delete the "id" points.
     *
     * @param id the id of the points to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/points/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePoints(@PathVariable Long id) {
        log.debug("REST request to delete Points : {}", id);
        pointsRepository.delete(id);
        pointsSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("points", id.toString())).build();
    }

    /**
     * SEARCH  /_search/points?query=:query : search for the points corresponding
     * to the query.
     *
     * @param query the query of the points search
     * @param pageable the pagination information
     * @return the result of the search
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/_search/points",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Points>> searchPoints(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Points for query {}", query);
        Page<Points> page = pointsSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/points");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}

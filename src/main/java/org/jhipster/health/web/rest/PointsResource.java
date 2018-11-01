package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PointsSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.jhipster.health.web.rest.vm.PointsPerMonth;
import org.jhipster.health.web.rest.vm.PointsPerWeek;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Points.
 */
@RestController
@RequestMapping("/api")
public class PointsResource {

    private final Logger log = LoggerFactory.getLogger(PointsResource.class);

    private static final String ENTITY_NAME = "points";

    private final PointsRepository pointsRepository;

    private final PointsSearchRepository pointsSearchRepository;

    private final UserRepository userRepository;

    public PointsResource(PointsRepository pointsRepository, PointsSearchRepository pointsSearchRepository, UserRepository userRepository) {
        this.pointsRepository = pointsRepository;
        this.pointsSearchRepository = pointsSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /points : Create a new points.
     *
     * @param points the points to create
     * @return the ResponseEntity with status 201 (Created) and with body the new points, or with status 400 (Bad Request) if the points has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/points")
    @Timed
    public ResponseEntity<?> createPoints(@Valid @RequestBody Points points) throws URISyntaxException {
        log.debug("REST request to save Points : {}", points);
        if (points.getId() != null) {
            throw new BadRequestAlertException("A new points cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (points.getUser() != null &&
            !points.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            points.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null));
        }
        Points result = pointsRepository.save(points);
        pointsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /points : Updates an existing points.
     *
     * @param points the points to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated points,
     * or with status 400 (Bad Request) if the points is not valid,
     * or with status 500 (Internal Server Error) if the points couldn't be updated
     */
    @PutMapping("/points")
    @Timed
    public ResponseEntity<?> updatePoints(@Valid @RequestBody Points points) {
        log.debug("REST request to update Points : {}", points);
        if (points.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (points.getUser() != null &&
            !points.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        Points result = pointsRepository.save(points);
        pointsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, points.getId().toString()))
            .body(result);
    }

    /**
     * GET  /points : get all the points.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of points in body
     */
    @GetMapping("/points")
    @Timed
    public ResponseEntity<List<Points>> getAllPoints(Pageable pageable) {
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
    @GetMapping("/points-this-week")
    @Timed
    public ResponseEntity<PointsPerWeek> getPointsThisWeek(
        @RequestParam(value="tz", required=false) String timezone) {

        // Get current date (with timezone if passed in)
        LocalDate now = LocalDate.now();
        if (timezone != null) {
            now = LocalDate.now(ZoneId.of(timezone));
        }

        // Get first day of week
        LocalDate startOfWeek = now.with(DayOfWeek.MONDAY);
        // Get last day of week
        LocalDate endOfWeek = now.with(DayOfWeek.SUNDAY);
        log.debug("Looking for points between: {} and {}", startOfWeek, endOfWeek);

        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(startOfWeek, endOfWeek, SecurityUtils.getCurrentUserLogin().orElse(null));
        return calculatePoints(startOfWeek, points);
    }

    /**
     * GET  /points-by-week/yyyy-MM-dd : get all the points for a particular week.
     */
    @GetMapping("/points-by-week/{date}")
    @Timed
    public ResponseEntity<PointsPerWeek> getPointsByWeek(@PathVariable @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date) {
        // Get first and last days of week
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = date.with(DayOfWeek.SUNDAY);
        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(startOfWeek, endOfWeek, SecurityUtils.getCurrentUserLogin().orElse(null));
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
     * GET  /points-by-month : get all the points for a particular current month.
     */
    @GetMapping("/points-by-month/{yearWithMonth}")
    @Timed
    public ResponseEntity<PointsPerMonth> getPointsByMonth(@PathVariable @DateTimeFormat(pattern="yyyy-MM") YearMonth yearWithMonth) {
        // Get last day of the month
        LocalDate endOfMonth = yearWithMonth.atEndOfMonth();
        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(yearWithMonth.atDay(1), endOfMonth, SecurityUtils.getCurrentUserLogin().orElse(null));
        PointsPerMonth pointsPerMonth = new PointsPerMonth(yearWithMonth, points);
        return new ResponseEntity<>(pointsPerMonth, HttpStatus.OK);
    }

    /**
     * GET  /points/:id : get the "id" points.
     *
     * @param id the id of the points to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the points, or with status 404 (Not Found)
     */
    @GetMapping("/points/{id}")
    @Timed
    public ResponseEntity<?> getPoints(@PathVariable Long id) {
        log.debug("REST request to get Points : {}", id);
        Optional<Points> points = pointsRepository.findById(id);
        if (points.isPresent() && points.get().getUser() != null &&
            !points.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(points);
    }

    /**
     * DELETE  /points/:id : delete the "id" points.
     *
     * @param id the id of the points to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/points/{id}")
    @Timed
    public ResponseEntity<?> deletePoints(@PathVariable Long id) {
        log.debug("REST request to delete Points : {}", id);
        Optional<Points> points = pointsRepository.findById(id);
        if (points.isPresent() && points.get().getUser() != null &&
            !points.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        pointsRepository.deleteById(id);
        pointsSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/points?query=:query : search for the points corresponding
     * to the query.
     *
     * @param query the query of the points search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/points")
    @Timed
    public ResponseEntity<List<Points>> searchPoints(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Points for query {}", query);
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().must(queryStringQuery(query));
        if (SecurityUtils.isAuthenticated() && !SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            queryBuilder = queryBuilder.filter(matchQuery("user.login",
                SecurityUtils.getCurrentUserLogin().orElse("")));
        }
        Page<Points> page = pointsSearchRepository.search(queryBuilder, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/points");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

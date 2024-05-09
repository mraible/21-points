package org.jhipster.health.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PointsSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.vm.PointsPerMonth;
import org.jhipster.health.web.rest.vm.PointsPerWeek;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jhipster.health.domain.Points}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PointsResource {

    private final Logger log = LoggerFactory.getLogger(PointsResource.class);

    private static final String ENTITY_NAME = "points";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PointsRepository pointsRepository;

    private final PointsSearchRepository pointsSearchRepository;

    private final UserRepository userRepository;

    public PointsResource(PointsRepository pointsRepository, PointsSearchRepository pointsSearchRepository, UserRepository userRepository) {
        this.pointsRepository = pointsRepository;
        this.pointsSearchRepository = pointsSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /points} : Create a new points.
     *
     * @param points the points to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new points, or with status {@code 400 (Bad Request)} if the points has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/points")
    public ResponseEntity<Points> createPoints(@Valid @RequestBody Points points) throws URISyntaxException {
        log.debug("REST request to save Points : {}", points);
        if (points.getId() != null) {
            throw new BadRequestAlertException("A new points cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin().orElse(""));
            points.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse("")).orElse(null));
        }
        Points result = pointsRepository.save(points);
        pointsSearchRepository.index(result);
        return ResponseEntity.created(new URI("/api/points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /points/:id} : Updates an existing points.
     *
     * @param id the id of the points to save.
     * @param points the points to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated points,
     * or with status {@code 400 (Bad Request)} if the points is not valid,
     * or with status {@code 500 (Internal Server Error)} if the points couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/points/{id}")
    public ResponseEntity<?> updatePoints(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Points points)
        throws URISyntaxException {
        log.debug("REST request to update Points : {}, {}", id, points);
        if (points.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, points.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!pointsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            points.getUser() != null &&
            !points.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        Points result = pointsRepository.save(points);
        pointsSearchRepository.index(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, points.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /points/:id} : Partial updates given fields of an existing points, field will ignore if it is null
     *
     * @param id the id of the points to save.
     * @param points the points to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated points,
     * or with status {@code 400 (Bad Request)} if the points is not valid,
     * or with status {@code 404 (Not Found)} if the points is not found,
     * or with status {@code 500 (Internal Server Error)} if the points couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/points/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<?> partialUpdatePoints(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Points points
    ) throws URISyntaxException {
        log.debug("REST request to partial update Points partially : {}, {}", id, points);
        if (points.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, points.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!pointsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            points.getUser() != null &&
            !points.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        Optional<Points> result = pointsRepository
            .findById(points.getId())
            .map(existingPoints -> {
                if (points.getDate() != null) {
                    existingPoints.setDate(points.getDate());
                }
                if (points.getExercise() != null) {
                    existingPoints.setExercise(points.getExercise());
                }
                if (points.getMeals() != null) {
                    existingPoints.setMeals(points.getMeals());
                }
                if (points.getAlcohol() != null) {
                    existingPoints.setAlcohol(points.getAlcohol());
                }
                if (points.getNotes() != null) {
                    existingPoints.setNotes(points.getNotes());
                }

                return existingPoints;
            })
            .map(pointsRepository::save)
            .map(savedPoints -> {
                pointsSearchRepository.save(savedPoints);

                return savedPoints;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, points.getId().toString())
        );
    }

    /**
     * {@code GET  /points} : get all the points.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of points in body.
     */
    @GetMapping("/points")
    public ResponseEntity<List<Points>> getAllPoints(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Points");
        Page<Points> page;
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            page = pointsRepository.findAllByOrderByDateDesc(pageable);
        } else {
            page = pointsRepository.findByUserIsCurrentUser(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /points/:id} : get the "id" points.
     *
     * @param id the id of the points to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the points, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/points/{id}")
    public ResponseEntity<?> getPoints(@PathVariable Long id) {
        log.debug("REST request to get Points : {}", id);
        Optional<Points> points = pointsRepository.findOneWithEagerRelationships(id);
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            points.isPresent() &&
            points.get().getUser() != null &&
            !points.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(points);
    }

    /**
     * {@code DELETE  /points/:id} : delete the "id" points.
     *
     * @param id the id of the points to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/points/{id}")
    public ResponseEntity<?> deletePoints(@PathVariable Long id) {
        log.debug("REST request to delete Points : {}", id);
        Optional<Points> points = pointsRepository.findById(id);
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            points.isPresent() &&
            points.get().getUser() != null &&
            !points.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        pointsRepository.deleteById(id);
        pointsSearchRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/points?query=:query} : search for the points corresponding
     * to the query.
     *
     * @param query the query of the points search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/points")
    public ResponseEntity<List<Points>> searchPoints(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Points for query {}", query);
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().must(queryStringQuery(query));
        if (SecurityUtils.isAuthenticated() && !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            queryBuilder = queryBuilder.filter(matchQuery("user.login", SecurityUtils.getCurrentUserLogin().orElse("")));
        }
        Page<Points> page = pointsSearchRepository.search(queryBuilder, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /points-by-week/yyyy-MM-dd} : get all the points for a particular week.
     *
     * @param date a date in a week to find points for.
     */
    @GetMapping("/points-by-week/{date}")
    public ResponseEntity<PointsPerWeek> getPointsByWeek(@PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        // Get first and last days of week
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = date.with(DayOfWeek.SUNDAY);
        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(
            startOfWeek,
            endOfWeek,
            SecurityUtils.getCurrentUserLogin().orElse(null)
        );
        return calculatePoints(startOfWeek, points);
    }

    /**
     * {@code GET  /points-by-month} : get all the points for a particular current month.
     *
     * @param yearWithMonth the year and month to find points for.
     */
    @GetMapping("/points-by-month/{yearWithMonth}")
    public ResponseEntity<PointsPerMonth> getPointsByMonth(@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearWithMonth) {
        // Get last day of the month
        LocalDate endOfMonth = yearWithMonth.atEndOfMonth();
        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(
            yearWithMonth.atDay(1),
            endOfMonth,
            SecurityUtils.getCurrentUserLogin().orElse(null)
        );
        PointsPerMonth pointsPerMonth = new PointsPerMonth(yearWithMonth, points);
        return new ResponseEntity<>(pointsPerMonth, HttpStatus.OK);
    }

    /**
     * {@code GET  /points-this-week} : get all the points for the current week
     *
     * @param timezone the user's timezone
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and a count of points in body.
     */
    @GetMapping("/points-this-week")
    public ResponseEntity<PointsPerWeek> getPointsThisWeek(@RequestParam(value = "tz", required = false) String timezone) {
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

        List<Points> points = pointsRepository.findAllByDateBetweenAndUserLogin(
            startOfWeek,
            endOfWeek,
            SecurityUtils.getCurrentUserLogin().orElse("")
        );
        return calculatePoints(startOfWeek, points);
    }

    private ResponseEntity<PointsPerWeek> calculatePoints(LocalDate startOfWeek, List<Points> points) {
        Integer numPoints = points.stream().mapToInt(p -> p.getExercise() + p.getMeals() + p.getAlcohol()).sum();

        PointsPerWeek count = new PointsPerWeek(startOfWeek, numPoints);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}

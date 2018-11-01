package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.jhipster.health.web.rest.vm.BloodPressureByPeriod;
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
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing BloodPressure.
 */
@RestController
@RequestMapping("/api")
public class BloodPressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressureResource.class);

    private static final String ENTITY_NAME = "bloodPressure";

    private final BloodPressureRepository bloodPressureRepository;

    private final BloodPressureSearchRepository bloodPressureSearchRepository;

    private final UserRepository userRepository;

    public BloodPressureResource(BloodPressureRepository bloodPressureRepository, BloodPressureSearchRepository bloodPressureSearchRepository, UserRepository userRepository) {
        this.bloodPressureRepository = bloodPressureRepository;
        this.bloodPressureSearchRepository = bloodPressureSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /blood-pressures : Create a new bloodPressure.
     *
     * @param bloodPressure the bloodPressure to create
     * @return the ResponseEntity with status 201 (Created) and with body the new bloodPressure, or with status 400 (Bad Request) if the bloodPressure has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/blood-pressures")
    @Timed
    public ResponseEntity<?> createBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() != null) {
            throw new BadRequestAlertException("A new bloodPressure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (bloodPressure.getUser() != null &&
            !bloodPressure.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            bloodPressure.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null));
        }
        BloodPressure result = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/blood-pressures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /blood-pressures : Updates an existing bloodPressure.
     *
     * @param bloodPressure the bloodPressure to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated bloodPressure,
     * or with status 400 (Bad Request) if the bloodPressure is not valid,
     * or with status 500 (Internal Server Error) if the bloodPressure couldn't be updated
     */
    @PutMapping("/blood-pressures")
    @Timed
    public ResponseEntity<?> updateBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) {
        log.debug("REST request to update BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (bloodPressure.getUser() != null &&
            !bloodPressure.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        BloodPressure result = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, bloodPressure.getId().toString()))
            .body(result);
    }

    /**
     * GET  /blood-pressures : get all the bloodPressures.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of bloodPressures in body
     */
    @GetMapping("/blood-pressures")
    @Timed
    public ResponseEntity<List<BloodPressure>> getAllBloodPressures(Pageable pageable) {
        log.debug("REST request to get a page of BloodPressures");
        Page<BloodPressure> page;
        if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            page = bloodPressureRepository.findAllByOrderByTimestampDesc(pageable);
        } else {
            page = bloodPressureRepository.findByUserIsCurrentUser(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/blood-pressures");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /bp-by-days : get all the blood pressure readings by last x days.
     */
    @GetMapping("/bp-by-days/{days}")
    @Timed
    public ResponseEntity<BloodPressureByPeriod> getByDays(@PathVariable int days) {
        ZonedDateTime rightNow = ZonedDateTime.now(ZoneOffset.UTC);
        ZonedDateTime daysAgo = rightNow.minusDays(days);

        List<BloodPressure> readings =
            bloodPressureRepository.findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(
                daysAgo, rightNow, SecurityUtils.getCurrentUserLogin().orElse(null));
        BloodPressureByPeriod response = new BloodPressureByPeriod("Last " + days + " Days", readings);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET  /bp-by-month : get all the blood pressure readings for a particular month.
     */
    @GetMapping("/bp-by-month/{date}")
    @Timed
    public ResponseEntity<BloodPressureByPeriod> getByMonth(@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) {
        LocalDate firstDay = date.atDay(1);
        LocalDate lastDay = date.atEndOfMonth();

        ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneOffset.UTC);

        List<BloodPressure> readings = bloodPressureRepository.
            findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(firstDay.atStartOfDay(zonedDateTime.getZone()),
                lastDay.plusDays(1).atStartOfDay(zonedDateTime.getZone()), SecurityUtils.getCurrentUserLogin().orElse(null));

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        String yearAndMonth = fmt.format(firstDay);

        BloodPressureByPeriod response = new BloodPressureByPeriod(yearAndMonth, readings);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET  /blood-pressures/:id : get the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the bloodPressure, or with status 404 (Not Found)
     */
    @GetMapping("/blood-pressures/{id}")
    @Timed
    public ResponseEntity<?> getBloodPressure(@PathVariable Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        Optional<BloodPressure> bloodPressure = bloodPressureRepository.findById(id);
        if (bloodPressure.isPresent() && bloodPressure.get().getUser() != null &&
            !bloodPressure.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(bloodPressure);
    }

    /**
     * DELETE  /blood-pressures/:id : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/blood-pressures/{id}")
    @Timed
    public ResponseEntity<?> deleteBloodPressure(@PathVariable Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);
        Optional<BloodPressure> bloodPressure = bloodPressureRepository.findById(id);
        if (bloodPressure.isPresent() && bloodPressure.get().getUser() != null &&
            !bloodPressure.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        bloodPressureRepository.deleteById(id);
        bloodPressureSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/blood-pressures?query=:query : search for the bloodPressure corresponding
     * to the query.
     *
     * @param query the query of the bloodPressure search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/blood-pressures")
    @Timed
    public ResponseEntity<List<BloodPressure>> searchBloodPressures(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of BloodPressures for query {}", query);
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().must(queryStringQuery(query));
        if (SecurityUtils.isAuthenticated() && !SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            queryBuilder = queryBuilder.filter(matchQuery("user.login",
                SecurityUtils.getCurrentUserLogin().orElse("")));
        }
        Page<BloodPressure> page = bloodPressureSearchRepository.search(queryBuilder, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/blood-pressures");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

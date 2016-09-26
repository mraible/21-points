package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.vm.BloodPressureByPeriod;
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
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing BloodPressure.
 */
@RestController
@RequestMapping("/api")
public class BloodPressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressureResource.class);

    @Inject
    private BloodPressureRepository bloodPressureRepository;

    @Inject
    private BloodPressureSearchRepository bloodPressureSearchRepository;

    @Inject
    private UserRepository userRepository;

    /**
     * POST  /blood-pressures : Create a new bloodPressure.
     *
     * @param bloodPressure the bloodPressure to create
     * @return the ResponseEntity with status 201 (Created) and with body the new bloodPressure, or with status 400 (Bad Request) if the bloodPressure has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/blood-pressures",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<BloodPressure> createBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("bloodPressure", "idexists", "A new bloodPressure cannot already have an ID")).body(null);
        }
        if (!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            bloodPressure.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get());
        }
        BloodPressure result = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/blood-pressures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("bloodPressure", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /blood-pressures : Updates an existing bloodPressure.
     *
     * @param bloodPressure the bloodPressure to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated bloodPressure,
     * or with status 400 (Bad Request) if the bloodPressure is not valid,
     * or with status 500 (Internal Server Error) if the bloodPressure couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/blood-pressures",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<BloodPressure> updateBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to update BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() == null) {
            return createBloodPressure(bloodPressure);
        }
        BloodPressure result = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("bloodPressure", bloodPressure.getId().toString()))
            .body(result);
    }

    /**
     * GET  /blood-pressures : get all the bloodPressures.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of bloodPressures in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/blood-pressures",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<BloodPressure>> getAllBloodPressures(Pageable pageable)
        throws URISyntaxException {
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
    @RequestMapping(value = "/bp-by-days/{days}")
    @Timed
    public ResponseEntity<BloodPressureByPeriod> getByDays(@PathVariable int days) {
        ZonedDateTime rightNow = ZonedDateTime.now(ZoneOffset.UTC);
        ZonedDateTime daysAgo = rightNow.minusDays(days);

        List<BloodPressure> readings =
            bloodPressureRepository.findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(
                daysAgo, rightNow, SecurityUtils.getCurrentUserLogin());
        BloodPressureByPeriod response = new BloodPressureByPeriod("Last " + days + " Days", readings);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET  /bp-by-month : get all the blood pressure readings for a particular month.
     */
    @RequestMapping(value = "/bp-by-month/{date}")
    @Timed
    public ResponseEntity<BloodPressureByPeriod> getByMonth(@PathVariable @DateTimeFormat(pattern="yyyy-MM") YearMonth date) {
        LocalDate firstDay = date.atDay(1);
        LocalDate lastDay = date.atEndOfMonth();

        ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneOffset.UTC);

        List<BloodPressure> readings = bloodPressureRepository.
            findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(firstDay.atStartOfDay(zonedDateTime.getZone()),
                lastDay.plusDays(1).atStartOfDay(zonedDateTime.getZone()), SecurityUtils.getCurrentUserLogin());

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
    @RequestMapping(value = "/blood-pressures/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<BloodPressure> getBloodPressure(@PathVariable Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        BloodPressure bloodPressure = bloodPressureRepository.findOne(id);
        return Optional.ofNullable(bloodPressure)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /blood-pressures/:id : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/blood-pressures/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteBloodPressure(@PathVariable Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);
        bloodPressureRepository.delete(id);
        bloodPressureSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("bloodPressure", id.toString())).build();
    }

    /**
     * SEARCH  /_search/blood-pressures?query=:query : search for the bloodPressure corresponding
     * to the query.
     *
     * @param query the query of the bloodPressure search
     * @param pageable the pagination information
     * @return the result of the search
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/_search/blood-pressures",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<BloodPressure>> searchBloodPressures(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of BloodPressures for query {}", query);
        Page<BloodPressure> page = bloodPressureSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/blood-pressures");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}

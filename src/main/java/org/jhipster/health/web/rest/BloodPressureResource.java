package org.jhipster.health.web.rest;

import co.elastic.clients.elasticsearch._types.query_dsl.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.errors.ElasticsearchExceptionMapper;
import org.jhipster.health.web.rest.vm.BloodPressureByPeriod;
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
 * REST controller for managing {@link org.jhipster.health.domain.BloodPressure}.
 */
@RestController
@RequestMapping("/api/blood-pressures")
@Transactional
public class BloodPressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressureResource.class);

    private static final String ENTITY_NAME = "bloodPressure";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BloodPressureRepository bloodPressureRepository;

    private final BloodPressureSearchRepository bloodPressureSearchRepository;

    private final UserRepository userRepository;

    public BloodPressureResource(
        BloodPressureRepository bloodPressureRepository,
        BloodPressureSearchRepository bloodPressureSearchRepository,
        UserRepository userRepository
    ) {
        this.bloodPressureRepository = bloodPressureRepository;
        this.bloodPressureSearchRepository = bloodPressureSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /blood-pressures} : Create a new bloodPressure.
     *
     * @param bloodPressure the bloodPressure to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bloodPressure, or with status {@code 400 (Bad Request)} if the bloodPressure has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<BloodPressure> createBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() != null) {
            throw new BadRequestAlertException("A new bloodPressure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin().orElse(""));
            bloodPressure.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse("")).orElse(null));
        }
        bloodPressure = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.index(bloodPressure);
        return ResponseEntity.created(new URI("/api/blood-pressures/" + bloodPressure.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, bloodPressure.getId().toString()))
            .body(bloodPressure);
    }

    /**
     * {@code PUT  /blood-pressures/:id} : Updates an existing bloodPressure.
     *
     * @param id the id of the bloodPressure to save.
     * @param bloodPressure the bloodPressure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloodPressure,
     * or with status {@code 400 (Bad Request)} if the bloodPressure is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bloodPressure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBloodPressure(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BloodPressure bloodPressure
    ) throws URISyntaxException {
        log.debug("REST request to update BloodPressure : {}, {}", id, bloodPressure);
        if (bloodPressure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloodPressure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!bloodPressureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            bloodPressure.getUser() != null &&
            !bloodPressure.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        bloodPressure = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.index(bloodPressure);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bloodPressure.getId().toString()))
            .body(bloodPressure);
    }

    /**
     * {@code PATCH  /blood-pressures/:id} : Partial updates given fields of an existing bloodPressure, field will ignore if it is null
     *
     * @param id the id of the bloodPressure to save.
     * @param bloodPressure the bloodPressure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloodPressure,
     * or with status {@code 400 (Bad Request)} if the bloodPressure is not valid,
     * or with status {@code 404 (Not Found)} if the bloodPressure is not found,
     * or with status {@code 500 (Internal Server Error)} if the bloodPressure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<?> partialUpdateBloodPressure(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BloodPressure bloodPressure
    ) throws URISyntaxException {
        log.debug("REST request to partial update BloodPressure partially : {}, {}", id, bloodPressure);
        if (bloodPressure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloodPressure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!bloodPressureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            bloodPressure.getUser() != null &&
            !bloodPressure.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        Optional<BloodPressure> result = bloodPressureRepository
            .findById(bloodPressure.getId())
            .map(existingBloodPressure -> {
                if (bloodPressure.getTimestamp() != null) {
                    existingBloodPressure.setTimestamp(bloodPressure.getTimestamp());
                }
                if (bloodPressure.getSystolic() != null) {
                    existingBloodPressure.setSystolic(bloodPressure.getSystolic());
                }
                if (bloodPressure.getDiastolic() != null) {
                    existingBloodPressure.setDiastolic(bloodPressure.getDiastolic());
                }

                return existingBloodPressure;
            })
            .map(bloodPressureRepository::save)
            .map(savedBloodPressure -> {
                bloodPressureSearchRepository.index(savedBloodPressure);
                return savedBloodPressure;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bloodPressure.getId().toString())
        );
    }

    /**
     * {@code GET  /blood-pressures} : get all the bloodPressures.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bloodPressures in body.
     */
    @GetMapping("")
    public ResponseEntity<List<BloodPressure>> getAllBloodPressures(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of BloodPressures");
        Page<BloodPressure> page;
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            if (eagerload) {
                page = bloodPressureRepository.findAllWithEagerRelationships(pageable);
            } else {
                page = bloodPressureRepository.findAll(pageable);
            }
        } else {
            page = bloodPressureRepository.findByUserIsCurrentUser(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /blood-pressures/:id} : get the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bloodPressure, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBloodPressure(@PathVariable("id") Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        Optional<BloodPressure> bloodPressure = bloodPressureRepository.findOneWithEagerRelationships(id);
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            bloodPressure.isPresent() &&
            bloodPressure.get().getUser() != null &&
            !bloodPressure.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(bloodPressure);
    }

    /**
     * {@code DELETE  /blood-pressures/:id} : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBloodPressure(@PathVariable("id") Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);
        Optional<BloodPressure> bloodPressure = bloodPressureRepository.findById(id);
        if (
            !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN) &&
            bloodPressure.isPresent() &&
            bloodPressure.get().getUser() != null &&
            !bloodPressure.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        bloodPressureRepository.deleteById(id);
        bloodPressureSearchRepository.deleteFromIndexById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /blood-pressures/_search?query=:query} : search for the bloodPressure corresponding
     * to the query.
     *
     * @param query the query of the bloodPressure search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search")
    public ResponseEntity<List<BloodPressure>> searchBloodPressures(
        @RequestParam("query") String query,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of BloodPressures for query {}", query);
        if (SecurityUtils.isAuthenticated() && !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            QueryVariant filterByUser = new MatchQuery.Builder()
                .field("user.login")
                .query(SecurityUtils.getCurrentUserLogin().orElse(""))
                .build();
            BoolQuery.Builder boolQueryBuilder = QueryBuilders.bool();
            boolQueryBuilder.should(new Query(filterByUser));
            query = new Query(boolQueryBuilder.build()).toString();
        }
        try {
            Page<BloodPressure> page = bloodPressureSearchRepository.search(query, pageable);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
            return ResponseEntity.ok().headers(headers).body(page.getContent());
        } catch (RuntimeException e) {
            throw ElasticsearchExceptionMapper.mapException(e);
        }
    }

    /**
     * {@code GET  blood-pressures/by-days/:days} : get all the blood pressure readings by last x days.
     *
     * @param days the number of days.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the {@link BloodPressureByPeriod}.
     */
    @RequestMapping(value = "/by-days/{days}")
    public ResponseEntity<BloodPressureByPeriod> getByDays(@PathVariable int days) {
        ZonedDateTime rightNow = ZonedDateTime.now();
        ZonedDateTime daysAgo = rightNow.minusDays(days);

        List<BloodPressure> readings = bloodPressureRepository.findAllByTimestampBetweenAndUserLoginOrderByTimestampAsc(
            daysAgo,
            rightNow,
            SecurityUtils.getCurrentUserLogin().orElse("")
        );
        BloodPressureByPeriod response = new BloodPressureByPeriod("Last " + days + " Days", readings);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * {@code GET  /blood-pressures/by-month/:date} : get all the blood pressure readings by last x days.
     *
     * @param date the year and month in yyyy-MM format.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the {@link BloodPressureByPeriod}.
     */
    @GetMapping("/by-month/{date}")
    public ResponseEntity<BloodPressureByPeriod> getByMonth(@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) {
        LocalDate firstDay = date.atDay(1);
        LocalDate lastDay = date.atEndOfMonth();

        ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneOffset.UTC);

        List<BloodPressure> readings = bloodPressureRepository.findAllByTimestampBetweenAndUserLoginOrderByTimestampDesc(
            firstDay.atStartOfDay(zonedDateTime.getZone()),
            lastDay.plusDays(1).atStartOfDay(zonedDateTime.getZone()),
            SecurityUtils.getCurrentUserLogin().orElse(null)
        );

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        String yearAndMonth = fmt.format(firstDay);

        BloodPressureByPeriod response = new BloodPressureByPeriod(yearAndMonth, readings);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

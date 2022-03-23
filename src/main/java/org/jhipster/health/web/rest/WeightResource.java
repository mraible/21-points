package org.jhipster.health.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import io.micrometer.core.annotation.Timed;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.jhipster.health.domain.Weight;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.WeightRepository;
import org.jhipster.health.repository.search.WeightSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.vm.WeightByPeriod;
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
 * REST controller for managing {@link org.jhipster.health.domain.Weight}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WeightResource {

    private final Logger log = LoggerFactory.getLogger(WeightResource.class);

    private static final String ENTITY_NAME = "weight";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WeightRepository weightRepository;

    private final WeightSearchRepository weightSearchRepository;

    private final UserRepository userRepository;

    public WeightResource(WeightRepository weightRepository, WeightSearchRepository weightSearchRepository, UserRepository userRepository) {
        this.weightRepository = weightRepository;
        this.weightSearchRepository = weightSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /weights} : Create a new weight.
     *
     * @param weight the weight to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new weight, or with status {@code 400 (Bad Request)} if the weight has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/weights")
    public ResponseEntity<?> createWeight(@Valid @RequestBody Weight weight) throws URISyntaxException {
        log.debug("REST request to save Weight : {}", weight);
        if (weight.getId() != null) {
            throw new BadRequestAlertException("A new weight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (weight.getUser() != null && !weight.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        if (!SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            log.debug("No user passed in, using current user: {}", SecurityUtils.getCurrentUserLogin());
            weight.setUser(userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin().orElse(null)).orElse(null));
        }
        if (weight.getTimestamp() == null) {
            // todo: get user's timezone from preferences
            weight.setTimestamp(ZonedDateTime.now());
        }
        Weight result = weightRepository.save(weight);
        weightSearchRepository.save(result);
        return ResponseEntity
            .created(new URI("/api/weights/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /weights/:id} : Updates an existing weight.
     *
     * @param id the id of the weight to save.
     * @param weight the weight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated weight,
     * or with status {@code 400 (Bad Request)} if the weight is not valid,
     * or with status {@code 500 (Internal Server Error)} if the weight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/weights/{id}")
    public ResponseEntity<?> updateWeight(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Weight weight)
        throws URISyntaxException {
        log.debug("REST request to update Weight : {}, {}", id, weight);
        if (weight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, weight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!weightRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (weight.getUser() != null && !weight.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }

        Weight result = weightRepository.save(weight);
        weightSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, weight.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /weights/:id} : Partial updates given fields of an existing weight, field will ignore if it is null
     *
     * @param id the id of the weight to save.
     * @param weight the weight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated weight,
     * or with status {@code 400 (Bad Request)} if the weight is not valid,
     * or with status {@code 404 (Not Found)} if the weight is not found,
     * or with status {@code 500 (Internal Server Error)} if the weight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/weights/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Weight> partialUpdateWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Weight weight
    ) throws URISyntaxException {
        log.debug("REST request to partial update Weight partially : {}, {}", id, weight);
        if (weight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, weight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!weightRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Weight> result = weightRepository
            .findById(weight.getId())
            .map(existingWeight -> {
                if (weight.getTimestamp() != null) {
                    existingWeight.setTimestamp(weight.getTimestamp());
                }
                if (weight.getWeight() != null) {
                    existingWeight.setWeight(weight.getWeight());
                }

                return existingWeight;
            })
            .map(weightRepository::save)
            .map(savedWeight -> {
                weightSearchRepository.save(savedWeight);

                return savedWeight;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, weight.getId().toString())
        );
    }

    /**
     * {@code GET  /weights} : get all the weights.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of weights in body.
     */
    @GetMapping("/weights")
    public ResponseEntity<List<Weight>> getAllWeights(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Weights");
        Page<Weight> page;
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            page = weightRepository.findAllByOrderByTimestampDesc(pageable);
        } else {
            page = weightRepository.findByUserIsCurrentUser(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /weight-by-days : get all the weigh-ins for last x days.
     */
    @GetMapping("/weight-by-days/{days}")
    @Timed
    public ResponseEntity<WeightByPeriod> getByDays(@PathVariable int days) {
        ZonedDateTime rightNow = ZonedDateTime.now(ZoneOffset.UTC);
        ZonedDateTime daysAgo = rightNow.minusDays(days);

        List<Weight> weighIns = weightRepository.findAllByTimestampBetweenOrderByTimestampDesc(daysAgo, rightNow);
        WeightByPeriod response = new WeightByPeriod("Last " + days + " Days", filterByUser(weighIns));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET  /bp-by-days -> get all the blood pressure readings for a particular month.
     */
    @GetMapping("/weight-by-month/{date}")
    public ResponseEntity<WeightByPeriod> getByMonth(@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth date) {
        LocalDate firstDay = date.atDay(1);
        LocalDate lastDay = date.atEndOfMonth();

        ZoneId timezone = ZoneId.of("Z");

        List<Weight> weighIns = weightRepository.findAllByTimestampBetweenOrderByTimestampDesc(
            firstDay.atStartOfDay(timezone),
            lastDay.plusDays(1).atStartOfDay(timezone)
        );

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        String yearAndMonth = fmt.format(firstDay);

        WeightByPeriod response = new WeightByPeriod(yearAndMonth, filterByUser(weighIns));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private List<Weight> filterByUser(List<Weight> readings) {
        Stream<Weight> userReadings = readings
            .stream()
            .filter(bp -> bp.getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(null)));
        return userReadings.collect(Collectors.toList());
    }

    /**
     * {@code GET  /weights/:id} : get the "id" weight.
     *
     * @param id the id of the weight to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the weight, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/weights/{id}")
    public ResponseEntity<?> getWeight(@PathVariable Long id) {
        log.debug("REST request to get Weight : {}", id);
        Optional<Weight> weight = weightRepository.findOneWithEagerRelationships(id);
        if (
            weight.isPresent() &&
            weight.get().getUser() != null &&
            !weight.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(weight);
    }

    /**
     * {@code DELETE  /weights/:id} : delete the "id" weight.
     *
     * @param id the id of the weight to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/weights/{id}")
    public ResponseEntity<?> deleteWeight(@PathVariable Long id) {
        log.debug("REST request to delete Weight : {}", id);
        Optional<Weight> weight = weightRepository.findById(id);
        if (
            weight.isPresent() &&
            weight.get().getUser() != null &&
            !weight.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        weightRepository.deleteById(id);
        weightSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/weights?query=:query} : search for the weight corresponding
     * to the query.
     *
     * @param query the query of the weight search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/weights")
    public ResponseEntity<List<Weight>> searchWeights(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Weights for query {}", query);
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().must(queryStringQuery(query));
        if (SecurityUtils.isAuthenticated() && !SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            queryBuilder = queryBuilder.filter(matchQuery("user.login", SecurityUtils.getCurrentUserLogin().orElse("")));
        }
        Page<Weight> page = weightSearchRepository.search(queryBuilder.toString(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

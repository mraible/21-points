package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.BloodPressure;

import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.util.HeaderUtil;
import org.jhipster.health.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

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

    public BloodPressureResource(BloodPressureRepository bloodPressureRepository, BloodPressureSearchRepository bloodPressureSearchRepository) {
        this.bloodPressureRepository = bloodPressureRepository;
        this.bloodPressureSearchRepository = bloodPressureSearchRepository;
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
    public ResponseEntity<BloodPressure> createBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() != null) {
            throw new BadRequestAlertException("A new bloodPressure cannot already have an ID", ENTITY_NAME, "idexists");
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
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/blood-pressures")
    @Timed
    public ResponseEntity<BloodPressure> updateBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to update BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() == null) {
            return createBloodPressure(bloodPressure);
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
        Page<BloodPressure> page = bloodPressureRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/blood-pressures");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /blood-pressures/:id : get the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the bloodPressure, or with status 404 (Not Found)
     */
    @GetMapping("/blood-pressures/{id}")
    @Timed
    public ResponseEntity<BloodPressure> getBloodPressure(@PathVariable Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        BloodPressure bloodPressure = bloodPressureRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(bloodPressure));
    }

    /**
     * DELETE  /blood-pressures/:id : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/blood-pressures/{id}")
    @Timed
    public ResponseEntity<Void> deleteBloodPressure(@PathVariable Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);
        bloodPressureRepository.delete(id);
        bloodPressureSearchRepository.delete(id);
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
        Page<BloodPressure> page = bloodPressureSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/blood-pressures");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}

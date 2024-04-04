package org.jhipster.health.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
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
@RequestMapping("/api")
@Transactional
public class BloodPressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressureResource.class);

    private static final String ENTITY_NAME = "bloodPressure";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BloodPressureRepository bloodPressureRepository;

    private final BloodPressureSearchRepository bloodPressureSearchRepository;

    public BloodPressureResource(
        BloodPressureRepository bloodPressureRepository,
        BloodPressureSearchRepository bloodPressureSearchRepository
    ) {
        this.bloodPressureRepository = bloodPressureRepository;
        this.bloodPressureSearchRepository = bloodPressureSearchRepository;
    }

    /**
     * {@code POST  /blood-pressures} : Create a new bloodPressure.
     *
     * @param bloodPressure the bloodPressure to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bloodPressure, or with status {@code 400 (Bad Request)} if the bloodPressure has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/blood-pressures")
    public ResponseEntity<BloodPressure> createBloodPressure(@Valid @RequestBody BloodPressure bloodPressure) throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() != null) {
            throw new BadRequestAlertException("A new bloodPressure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BloodPressure result = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.index(result);
        return ResponseEntity.created(new URI("/api/blood-pressures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
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
    @PutMapping("/blood-pressures/{id}")
    public ResponseEntity<BloodPressure> updateBloodPressure(
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

        BloodPressure result = bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.index(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bloodPressure.getId().toString()))
            .body(result);
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
    @PatchMapping(value = "/blood-pressures/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BloodPressure> partialUpdateBloodPressure(
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
                bloodPressureSearchRepository.save(savedBloodPressure);

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
    @GetMapping("/blood-pressures")
    public ResponseEntity<List<BloodPressure>> getAllBloodPressures(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of BloodPressures");
        Page<BloodPressure> page;
        if (eagerload) {
            page = bloodPressureRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = bloodPressureRepository.findAll(pageable);
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
    @GetMapping("/blood-pressures/{id}")
    public ResponseEntity<BloodPressure> getBloodPressure(@PathVariable Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        Optional<BloodPressure> bloodPressure = bloodPressureRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(bloodPressure);
    }

    /**
     * {@code DELETE  /blood-pressures/:id} : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/blood-pressures/{id}")
    public ResponseEntity<Void> deleteBloodPressure(@PathVariable Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);
        bloodPressureRepository.deleteById(id);
        bloodPressureSearchRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/blood-pressures?query=:query} : search for the bloodPressure corresponding
     * to the query.
     *
     * @param query the query of the bloodPressure search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/blood-pressures")
    public ResponseEntity<List<BloodPressure>> searchBloodPressures(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of BloodPressures for query {}", query);
        Page<BloodPressure> page = bloodPressureSearchRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}

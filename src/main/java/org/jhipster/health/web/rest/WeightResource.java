package org.jhipster.health.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.jhipster.health.domain.Weight;
import org.jhipster.health.repository.WeightRepository;
import org.jhipster.health.repository.search.WeightSearchRepository;
import org.jhipster.health.web.rest.errors.BadRequestAlertException;
import org.jhipster.health.web.rest.errors.ElasticsearchExceptionMapper;
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
 * REST controller for managing {@link org.jhipster.health.domain.Weight}.
 */
@RestController
@RequestMapping("/api/weights")
@Transactional
public class WeightResource {

    private final Logger log = LoggerFactory.getLogger(WeightResource.class);

    private static final String ENTITY_NAME = "weight";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WeightRepository weightRepository;

    private final WeightSearchRepository weightSearchRepository;

    public WeightResource(WeightRepository weightRepository, WeightSearchRepository weightSearchRepository) {
        this.weightRepository = weightRepository;
        this.weightSearchRepository = weightSearchRepository;
    }

    /**
     * {@code POST  /weights} : Create a new weight.
     *
     * @param weight the weight to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new weight, or with status {@code 400 (Bad Request)} if the weight has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Weight> createWeight(@Valid @RequestBody Weight weight) throws URISyntaxException {
        log.debug("REST request to save Weight : {}", weight);
        if (weight.getId() != null) {
            throw new BadRequestAlertException("A new weight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        weight = weightRepository.save(weight);
        weightSearchRepository.index(weight);
        return ResponseEntity.created(new URI("/api/weights/" + weight.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, weight.getId().toString()))
            .body(weight);
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
    @PutMapping("/{id}")
    public ResponseEntity<Weight> updateWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Weight weight
    ) throws URISyntaxException {
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

        weight = weightRepository.save(weight);
        weightSearchRepository.index(weight);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, weight.getId().toString()))
            .body(weight);
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
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
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
                weightSearchRepository.index(savedWeight);
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
    @GetMapping("")
    public ResponseEntity<List<Weight>> getAllWeights(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of Weights");
        Page<Weight> page;
        if (eagerload) {
            page = weightRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = weightRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /weights/:id} : get the "id" weight.
     *
     * @param id the id of the weight to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the weight, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Weight> getWeight(@PathVariable("id") Long id) {
        log.debug("REST request to get Weight : {}", id);
        Optional<Weight> weight = weightRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(weight);
    }

    /**
     * {@code DELETE  /weights/:id} : delete the "id" weight.
     *
     * @param id the id of the weight to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeight(@PathVariable("id") Long id) {
        log.debug("REST request to delete Weight : {}", id);
        weightRepository.deleteById(id);
        weightSearchRepository.deleteFromIndexById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /weights/_search?query=:query} : search for the weight corresponding
     * to the query.
     *
     * @param query the query of the weight search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search")
    public ResponseEntity<List<Weight>> searchWeights(
        @RequestParam("query") String query,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Weights for query {}", query);
        try {
            Page<Weight> page = weightSearchRepository.search(query, pageable);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
            return ResponseEntity.ok().headers(headers).body(page.getContent());
        } catch (RuntimeException e) {
            throw ElasticsearchExceptionMapper.mapException(e);
        }
    }
}

package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.Metric;
import org.jhipster.health.repository.MetricRepository;
import org.jhipster.health.repository.search.MetricSearchRepository;
import org.jhipster.health.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Metric.
 */
@RestController
@RequestMapping("/api")
public class MetricResource {

    private final Logger log = LoggerFactory.getLogger(MetricResource.class);

    @Inject
    private MetricRepository metricRepository;

    @Inject
    private MetricSearchRepository metricSearchRepository;

    /**
     * POST  /metrics -> Create a new metric.
     */
    @RequestMapping(value = "/metrics",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody Metric metric) throws URISyntaxException {
        log.debug("REST request to save Metric : {}", metric);
        if (metric.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new metric cannot already have an ID").build();
        }
        metricRepository.save(metric);
        metricSearchRepository.save(metric);
        return ResponseEntity.created(new URI("/api/metrics/" + metric.getId())).build();
    }

    /**
     * PUT  /metrics -> Updates an existing metric.
     */
    @RequestMapping(value = "/metrics",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody Metric metric) throws URISyntaxException {
        log.debug("REST request to update Metric : {}", metric);
        if (metric.getId() == null) {
            return create(metric);
        }
        metricRepository.save(metric);
        metricSearchRepository.save(metric);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /metrics -> get all the metrics.
     */
    @RequestMapping(value = "/metrics",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Metric>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<Metric> page = metricRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/metrics", offset, limit);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /metrics/:id -> get the "id" metric.
     */
    @RequestMapping(value = "/metrics/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Metric> get(@PathVariable Long id) {
        log.debug("REST request to get Metric : {}", id);
        return Optional.ofNullable(metricRepository.findOne(id))
            .map(metric -> new ResponseEntity<>(
                metric,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /metrics/:id -> delete the "id" metric.
     */
    @RequestMapping(value = "/metrics/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete Metric : {}", id);
        metricRepository.delete(id);
        metricSearchRepository.delete(id);
    }

    /**
     * SEARCH  /_search/metrics/:query -> search for the metric corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/metrics/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Metric> search(@PathVariable String query) {
        return StreamSupport
            .stream(metricSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

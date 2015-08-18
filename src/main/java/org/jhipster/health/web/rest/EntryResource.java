package org.jhipster.health.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.health.domain.Entry;
import org.jhipster.health.repository.EntryRepository;
import org.jhipster.health.repository.search.EntrySearchRepository;
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
 * REST controller for managing Entry.
 */
@RestController
@RequestMapping("/api")
public class EntryResource {

    private final Logger log = LoggerFactory.getLogger(EntryResource.class);

    @Inject
    private EntryRepository entryRepository;

    @Inject
    private EntrySearchRepository entrySearchRepository;

    /**
     * POST  /entrys -> Create a new entry.
     */
    @RequestMapping(value = "/entrys",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody Entry entry) throws URISyntaxException {
        log.debug("REST request to save Entry : {}", entry);
        if (entry.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new entry cannot already have an ID").build();
        }
        entryRepository.save(entry);
        entrySearchRepository.save(entry);
        return ResponseEntity.created(new URI("/api/entrys/" + entry.getId())).build();
    }

    /**
     * PUT  /entrys -> Updates an existing entry.
     */
    @RequestMapping(value = "/entrys",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody Entry entry) throws URISyntaxException {
        log.debug("REST request to update Entry : {}", entry);
        if (entry.getId() == null) {
            return create(entry);
        }
        entryRepository.save(entry);
        entrySearchRepository.save(entry);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /entrys -> get all the entrys.
     */
    @RequestMapping(value = "/entrys",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Entry>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<Entry> page = entryRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/entrys", offset, limit);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /entrys/:id -> get the "id" entry.
     */
    @RequestMapping(value = "/entrys/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Entry> get(@PathVariable Long id) {
        log.debug("REST request to get Entry : {}", id);
        return Optional.ofNullable(entryRepository.findOneWithEagerRelationships(id))
            .map(entry -> new ResponseEntity<>(
                entry,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /entrys/:id -> delete the "id" entry.
     */
    @RequestMapping(value = "/entrys/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete Entry : {}", id);
        entryRepository.delete(id);
        entrySearchRepository.delete(id);
    }

    /**
     * SEARCH  /_search/entrys/:query -> search for the entry corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/entrys/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Entry> search(@PathVariable String query) {
        return StreamSupport
            .stream(entrySearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}

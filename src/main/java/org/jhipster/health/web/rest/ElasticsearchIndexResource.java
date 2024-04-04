package org.jhipster.health.web.rest;

import io.micrometer.core.annotation.Timed;
import java.net.URISyntaxException;
import java.util.List;
import org.jhipster.health.security.AuthoritiesConstants;
import org.jhipster.health.security.SecurityUtils;
import org.jhipster.health.service.ElasticsearchIndexService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;

/**
 * REST controller for managing Elasticsearch index.
 */
@RestController
@RequestMapping("/api")
public class ElasticsearchIndexResource {

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexResource.class);

    private final ElasticsearchIndexService elasticsearchIndexService;

    public ElasticsearchIndexResource(ElasticsearchIndexService elasticsearchIndexService) {
        this.elasticsearchIndexService = elasticsearchIndexService;
    }

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    /**
     * POST  /elasticsearch/index -> Reindex all Elasticsearch documents
     */
    @PostMapping("/elasticsearch/index")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> reindexAll() throws URISyntaxException {
        log.info("REST request to reindex Elasticsearch by user : {}, all entities", SecurityUtils.getCurrentUserLogin());
        elasticsearchIndexService.reindexSelected(null, true);
        return ResponseEntity.accepted().headers(HeaderUtil.createAlert(applicationName, "elasticsearch.reindex.accepted", "")).build();
    }

    /**
     * POST  /elasticsearch/selected -> Reindex selected Elasticsearch documents
     */
    @PostMapping("/elasticsearch/selected")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> reindexSelected(@RequestBody List<String> selectedEntities) throws URISyntaxException {
        log.info("REST request to reindex Elasticsearch by user : {}, entities: {}", SecurityUtils.getCurrentUserLogin(), selectedEntities);
        elasticsearchIndexService.reindexSelected(selectedEntities, false);
        return ResponseEntity
            .accepted()
            .headers(HeaderUtil.createAlert(applicationName, "elasticsearch.reindex.acceptedSelected", ""))
            .build();
    }
}

package org.jhipster.health.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.RefreshPolicy;

@Configuration
public class ElasticsearchTestConfiguration {

    @Autowired
    ElasticsearchTemplate template;

    @PostConstruct
    public void configureTemplate() {
        this.template.setRefreshPolicy(RefreshPolicy.IMMEDIATE);
    }
}

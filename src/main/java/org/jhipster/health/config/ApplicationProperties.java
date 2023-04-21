package org.jhipster.health.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Twenty One Points.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Elasticsearch elasticsearch = new Elasticsearch();

    public Elasticsearch getElasticsearch() {
        return elasticsearch;
    }

    public static class Elasticsearch {

        private boolean reindexOnStartup;

        public boolean getReindexOnStartup() {
            return reindexOnStartup;
        }

        public void setReindexOnStartup(boolean reindexOnStartup) {
            this.reindexOnStartup = reindexOnStartup;
        }
    }
    // jhipster-needle-application-properties-property
    // jhipster-needle-application-properties-property-getter
    // jhipster-needle-application-properties-property-class
}

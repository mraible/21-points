package org.jhipster.health.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to 21-Points Health.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Liquibase liquibase = new Liquibase();

    // jhipster-needle-application-properties-property

    public Liquibase getLiquibase() {
        return liquibase;
    }

    // jhipster-needle-application-properties-property-getter

    public static class Liquibase {

        private Boolean asyncStart;

        public Boolean getAsyncStart() {
            return asyncStart;
        }

        public void setAsyncStart(Boolean asyncStart) {
            this.asyncStart = asyncStart;
        }
    }

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
    // jhipster-needle-application-properties-property-class
}

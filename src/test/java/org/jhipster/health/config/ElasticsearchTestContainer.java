package org.jhipster.health.config;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Base class for starting/stopping ElasticSearch during tests.
 */
public class ElasticsearchTestContainer implements InitializingBean, DisposableBean {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchTestContainer.class);
    private static final Integer CONTAINER_STARTUP_TIMEOUT_MINUTES = 10;
    private ElasticsearchContainer elasticsearchContainer;

    @Override
    public void destroy() {
        if (null != elasticsearchContainer && elasticsearchContainer.isRunning()) {
            elasticsearchContainer.close();
        }
    }

    @Override
    public void afterPropertiesSet() {
        if (null == elasticsearchContainer) {
            elasticsearchContainer =
                new ElasticsearchContainer(DockerImageName.parse("docker.elastic.co/elasticsearch/elasticsearch").withTag("7.17.4"))
                    .withStartupTimeout(Duration.of(CONTAINER_STARTUP_TIMEOUT_MINUTES, ChronoUnit.MINUTES))
                    .withSharedMemorySize(256000000L)
                    .withEnv("ES_JAVA_OPTS", "-Xms256m -Xmx256m")
                    .withEnv("xpack.security.enabled", "false")
                    .withLogConsumer(new Slf4jLogConsumer(log))
                    .withReuse(true);
        }
        if (!elasticsearchContainer.isRunning()) {
            elasticsearchContainer.start();
        }
    }

    public ElasticsearchContainer getElasticsearchContainer() {
        return elasticsearchContainer;
    }
}

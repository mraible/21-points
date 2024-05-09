package org.jhipster.health.config;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.test.context.ContextConfigurationAttributes;
import org.springframework.test.context.ContextCustomizer;
import org.springframework.test.context.ContextCustomizerFactory;
import org.springframework.test.context.MergedContextConfiguration;

public class TestContainersSpringContextCustomizerFactory implements ContextCustomizerFactory {

    private Logger log = LoggerFactory.getLogger(TestContainersSpringContextCustomizerFactory.class);

    private static ElasticsearchTestContainer elasticsearchBean;

    @Override
    public ContextCustomizer createContextCustomizer(Class<?> testClass, List<ContextConfigurationAttributes> configAttributes) {
        return new ContextCustomizer() {
            @Override
            public void customizeContext(ConfigurableApplicationContext context, MergedContextConfiguration mergedConfig) {
                ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
                TestPropertyValues testValues = TestPropertyValues.empty();
                EmbeddedElasticsearch elasticsearchAnnotation = AnnotatedElementUtils.findMergedAnnotation(
                    testClass,
                    EmbeddedElasticsearch.class
                );
                if (null != elasticsearchAnnotation) {
                    log.debug("detected the EmbeddedElasticsearch annotation on class {}", testClass.getName());
                    log.info("Warming up the elastic database");
                    if (null == elasticsearchBean) {
                        elasticsearchBean = beanFactory.createBean(ElasticsearchTestContainer.class);
                        beanFactory.registerSingleton(ElasticsearchTestContainer.class.getName(), elasticsearchBean);
                        // ((DefaultListableBeanFactory)beanFactory).registerDisposableBean(ElasticsearchTestContainer.class.getName(), elasticsearchBean);
                    }
                    testValues = testValues.and(
                        "spring.elasticsearch.uris=http://" + elasticsearchBean.getElasticsearchContainer().getHttpHostAddress()
                    );
                }
                testValues.applyTo(context);
            }

            @Override
            public int hashCode() {
                return ElasticsearchTestContainer.class.getName().hashCode();
            }

            @Override
            public boolean equals(Object obj) {
                return this.hashCode() == obj.hashCode();
            }
        };
    }
}

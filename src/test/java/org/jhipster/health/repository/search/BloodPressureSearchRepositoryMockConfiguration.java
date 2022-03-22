package org.jhipster.health.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of BloodPressureSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class BloodPressureSearchRepositoryMockConfiguration {

    @MockBean
    private BloodPressureSearchRepository mockBloodPressureSearchRepository;

}

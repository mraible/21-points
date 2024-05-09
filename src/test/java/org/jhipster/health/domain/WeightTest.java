package org.jhipster.health.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.health.domain.WeightTestSamples.*;

import org.jhipster.health.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WeightTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Weight.class);
        Weight weight1 = getWeightSample1();
        Weight weight2 = new Weight();
        assertThat(weight1).isNotEqualTo(weight2);

        weight2.setId(weight1.getId());
        assertThat(weight1).isEqualTo(weight2);

        weight2 = getWeightSample2();
        assertThat(weight1).isNotEqualTo(weight2);
    }
}

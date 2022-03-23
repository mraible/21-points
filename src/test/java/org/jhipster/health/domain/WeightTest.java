package org.jhipster.health.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.jhipster.health.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WeightTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Weight.class);
        Weight weight1 = new Weight();
        weight1.setId(1L);
        Weight weight2 = new Weight();
        weight2.setId(weight1.getId());
        assertThat(weight1).isEqualTo(weight2);
        weight2.setId(2L);
        assertThat(weight1).isNotEqualTo(weight2);
        weight1.setId(null);
        assertThat(weight1).isNotEqualTo(weight2);
    }
}

package org.jhipster.health.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.jhipster.health.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PreferencesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Preferences.class);
        Preferences preferences1 = new Preferences();
        preferences1.setId(1L);
        Preferences preferences2 = new Preferences();
        preferences2.setId(preferences1.getId());
        assertThat(preferences1).isEqualTo(preferences2);
        preferences2.setId(2L);
        assertThat(preferences1).isNotEqualTo(preferences2);
        preferences1.setId(null);
        assertThat(preferences1).isNotEqualTo(preferences2);
    }
}

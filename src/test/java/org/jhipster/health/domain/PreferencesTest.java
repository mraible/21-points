package org.jhipster.health.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jhipster.health.domain.PreferencesTestSamples.*;

import org.jhipster.health.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PreferencesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Preferences.class);
        Preferences preferences1 = getPreferencesSample1();
        Preferences preferences2 = new Preferences();
        assertThat(preferences1).isNotEqualTo(preferences2);

        preferences2.setId(preferences1.getId());
        assertThat(preferences1).isEqualTo(preferences2);

        preferences2 = getPreferencesSample2();
        assertThat(preferences1).isNotEqualTo(preferences2);
    }
}

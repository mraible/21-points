package org.jhipster.health.web.rest;

import org.jhipster.health.Application;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.repository.PreferencesRepository;
import org.jhipster.health.repository.search.PreferencesSearchRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.jhipster.health.domain.enumeration.Units;

/**
 * Test class for the PreferencesResource REST controller.
 *
 * @see PreferencesResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class PreferencesResourceTest {


    private static final Integer DEFAULT_WEEKLY_GOAL = 10;
    private static final Integer UPDATED_WEEKLY_GOAL = 11;

    private static final Units DEFAULT_WEIGHT_UNITS = Units.kg;
    private static final Units UPDATED_WEIGHT_UNITS = Units.lb;

    @Inject
    private PreferencesRepository preferencesRepository;

    @Inject
    private PreferencesSearchRepository preferencesSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restPreferencesMockMvc;

    private Preferences preferences;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PreferencesResource preferencesResource = new PreferencesResource();
        ReflectionTestUtils.setField(preferencesResource, "preferencesRepository", preferencesRepository);
        ReflectionTestUtils.setField(preferencesResource, "preferencesSearchRepository", preferencesSearchRepository);
        this.restPreferencesMockMvc = MockMvcBuilders.standaloneSetup(preferencesResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        preferences = new Preferences();
        preferences.setWeekly_goal(DEFAULT_WEEKLY_GOAL);
        preferences.setWeight_units(DEFAULT_WEIGHT_UNITS);
    }

    @Test
    @Transactional
    public void createPreferences() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().size();

        // Create the Preferences

        restPreferencesMockMvc.perform(post("/api/preferencess")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(preferences)))
                .andExpect(status().isCreated());

        // Validate the Preferences in the database
        List<Preferences> preferencess = preferencesRepository.findAll();
        assertThat(preferencess).hasSize(databaseSizeBeforeCreate + 1);
        Preferences testPreferences = preferencess.get(preferencess.size() - 1);
        assertThat(testPreferences.getWeekly_goal()).isEqualTo(DEFAULT_WEEKLY_GOAL);
        assertThat(testPreferences.getWeight_units()).isEqualTo(DEFAULT_WEIGHT_UNITS);
    }

    @Test
    @Transactional
    public void checkWeekly_goalIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().size();
        // set the field null
        preferences.setWeekly_goal(null);

        // Create the Preferences, which fails.

        restPreferencesMockMvc.perform(post("/api/preferencess")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(preferences)))
                .andExpect(status().isBadRequest());

        List<Preferences> preferencess = preferencesRepository.findAll();
        assertThat(preferencess).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWeight_unitsIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().size();
        // set the field null
        preferences.setWeight_units(null);

        // Create the Preferences, which fails.

        restPreferencesMockMvc.perform(post("/api/preferencess")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(preferences)))
                .andExpect(status().isBadRequest());

        List<Preferences> preferencess = preferencesRepository.findAll();
        assertThat(preferencess).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPreferencess() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get all the preferencess
        restPreferencesMockMvc.perform(get("/api/preferencess"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
                .andExpect(jsonPath("$.[*].weekly_goal").value(hasItem(DEFAULT_WEEKLY_GOAL)))
                .andExpect(jsonPath("$.[*].weight_units").value(hasItem(DEFAULT_WEIGHT_UNITS.toString())));
    }

    @Test
    @Transactional
    public void getPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferencess/{id}", preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(preferences.getId().intValue()))
            .andExpect(jsonPath("$.weekly_goal").value(DEFAULT_WEEKLY_GOAL))
            .andExpect(jsonPath("$.weight_units").value(DEFAULT_WEIGHT_UNITS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPreferences() throws Exception {
        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferencess/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

		int databaseSizeBeforeUpdate = preferencesRepository.findAll().size();

        // Update the preferences
        preferences.setWeekly_goal(UPDATED_WEEKLY_GOAL);
        preferences.setWeight_units(UPDATED_WEIGHT_UNITS);
        

        restPreferencesMockMvc.perform(put("/api/preferencess")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(preferences)))
                .andExpect(status().isOk());

        // Validate the Preferences in the database
        List<Preferences> preferencess = preferencesRepository.findAll();
        assertThat(preferencess).hasSize(databaseSizeBeforeUpdate);
        Preferences testPreferences = preferencess.get(preferencess.size() - 1);
        assertThat(testPreferences.getWeekly_goal()).isEqualTo(UPDATED_WEEKLY_GOAL);
        assertThat(testPreferences.getWeight_units()).isEqualTo(UPDATED_WEIGHT_UNITS);
    }

    @Test
    @Transactional
    public void deletePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

		int databaseSizeBeforeDelete = preferencesRepository.findAll().size();

        // Get the preferences
        restPreferencesMockMvc.perform(delete("/api/preferencess/{id}", preferences.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Preferences> preferencess = preferencesRepository.findAll();
        assertThat(preferencess).hasSize(databaseSizeBeforeDelete - 1);
    }
}

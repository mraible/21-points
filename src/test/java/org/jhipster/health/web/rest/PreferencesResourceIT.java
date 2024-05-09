package org.jhipster.health.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.hasItem;
import static org.jhipster.health.domain.PreferencesAsserts.*;
import static org.jhipster.health.web.rest.TestUtil.createUpdateProxyForBean;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.assertj.core.util.IterableUtil;
import org.jhipster.health.IntegrationTest;
import org.jhipster.health.domain.Preferences;
import org.jhipster.health.domain.enumeration.Units;
import org.jhipster.health.repository.PreferencesRepository;
import org.jhipster.health.repository.search.PreferencesSearchRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Streamable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PreferencesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PreferencesResourceIT {

    private static final Integer DEFAULT_WEEKLY_GOAL = 10;
    private static final Integer UPDATED_WEEKLY_GOAL = 11;

    private static final Units DEFAULT_WEIGHT_UNITS = Units.KG;
    private static final Units UPDATED_WEIGHT_UNITS = Units.LB;

    private static final String ENTITY_API_URL = "/api/preferences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/preferences/_search";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PreferencesRepository preferencesRepository;

    @Mock
    private PreferencesRepository preferencesRepositoryMock;

    @Autowired
    private PreferencesSearchRepository preferencesSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPreferencesMockMvc;

    private Preferences preferences;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createEntity(EntityManager em) {
        Preferences preferences = new Preferences().weeklyGoal(DEFAULT_WEEKLY_GOAL).weightUnits(DEFAULT_WEIGHT_UNITS);
        return preferences;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createUpdatedEntity(EntityManager em) {
        Preferences preferences = new Preferences().weeklyGoal(UPDATED_WEEKLY_GOAL).weightUnits(UPDATED_WEIGHT_UNITS);
        return preferences;
    }

    @AfterEach
    public void cleanupElasticSearchRepository() {
        preferencesSearchRepository.deleteAll();
        assertThat(preferencesSearchRepository.count()).isEqualTo(0);
    }

    @BeforeEach
    public void initTest() {
        preferences = createEntity(em);
    }

    @Test
    @Transactional
    void createPreferences() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        // Create the Preferences
        var returnedPreferences = om.readValue(
            restPreferencesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(preferences)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Preferences.class
        );

        // Validate the Preferences in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPreferencesUpdatableFieldsEquals(returnedPreferences, getPersistedPreferences(returnedPreferences));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore + 1);
            });
    }

    @Test
    @Transactional
    void createPreferencesWithExistingId() throws Exception {
        // Create the Preferences with an existing ID
        preferences.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());

        // An entity with an existing ID cannot be created, so this API call must fail
        restPreferencesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(preferences)))
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkWeeklyGoalIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        // set the field null
        preferences.setWeeklyGoal(null);

        // Create the Preferences, which fails.

        restPreferencesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(preferences)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkWeightUnitsIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        // set the field null
        preferences.setWeightUnits(null);

        // Create the Preferences, which fails.

        restPreferencesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(preferences)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void getAllPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get all the preferencesList
        restPreferencesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].weeklyGoal").value(hasItem(DEFAULT_WEEKLY_GOAL)))
            .andExpect(jsonPath("$.[*].weightUnits").value(hasItem(DEFAULT_WEIGHT_UNITS.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPreferencesWithEagerRelationshipsIsEnabled() throws Exception {
        when(preferencesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPreferencesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(preferencesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPreferencesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(preferencesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPreferencesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(preferencesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get the preferences
        restPreferencesMockMvc
            .perform(get(ENTITY_API_URL_ID, preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(preferences.getId().intValue()))
            .andExpect(jsonPath("$.weeklyGoal").value(DEFAULT_WEEKLY_GOAL))
            .andExpect(jsonPath("$.weightUnits").value(DEFAULT_WEIGHT_UNITS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPreferences() throws Exception {
        // Get the preferences
        restPreferencesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        long databaseSizeBeforeUpdate = getRepositoryCount();
        preferencesSearchRepository.save(preferences);
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());

        // Update the preferences
        Preferences updatedPreferences = preferencesRepository.findById(preferences.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPreferences are not directly saved in db
        em.detach(updatedPreferences);
        updatedPreferences.weeklyGoal(UPDATED_WEEKLY_GOAL).weightUnits(UPDATED_WEIGHT_UNITS);

        restPreferencesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPreferences.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPreferences))
            )
            .andExpect(status().isOk());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPreferencesToMatchAllProperties(updatedPreferences);

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
                List<Preferences> preferencesSearchList = Streamable.of(preferencesSearchRepository.findAll()).toList();
                Preferences testPreferencesSearch = preferencesSearchList.get(searchDatabaseSizeAfter - 1);

                assertPreferencesAllPropertiesEquals(testPreferencesSearch, updatedPreferences);
            });
    }

    @Test
    @Transactional
    void putNonExistingPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        preferences.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPreferencesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, preferences.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(preferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithIdMismatchPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        preferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPreferencesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(preferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        preferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPreferencesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(preferences)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void partialUpdatePreferencesWithPatch() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the preferences using partial update
        Preferences partialUpdatedPreferences = new Preferences();
        partialUpdatedPreferences.setId(preferences.getId());

        partialUpdatedPreferences.weightUnits(UPDATED_WEIGHT_UNITS);

        restPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPreferences.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPreferences))
            )
            .andExpect(status().isOk());

        // Validate the Preferences in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPreferencesUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPreferences, preferences),
            getPersistedPreferences(preferences)
        );
    }

    @Test
    @Transactional
    void fullUpdatePreferencesWithPatch() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the preferences using partial update
        Preferences partialUpdatedPreferences = new Preferences();
        partialUpdatedPreferences.setId(preferences.getId());

        partialUpdatedPreferences.weeklyGoal(UPDATED_WEEKLY_GOAL).weightUnits(UPDATED_WEIGHT_UNITS);

        restPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPreferences.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPreferences))
            )
            .andExpect(status().isOk());

        // Validate the Preferences in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPreferencesUpdatableFieldsEquals(partialUpdatedPreferences, getPersistedPreferences(partialUpdatedPreferences));
    }

    @Test
    @Transactional
    void patchNonExistingPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        preferences.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, preferences.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(preferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        preferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPreferencesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(preferences))
            )
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPreferences() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        preferences.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPreferencesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(preferences)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Preferences in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void deletePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);
        preferencesRepository.save(preferences);
        preferencesSearchRepository.save(preferences);

        long databaseSizeBeforeDelete = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeBefore).isEqualTo(databaseSizeBeforeDelete);

        // Delete the preferences
        restPreferencesMockMvc
            .perform(delete(ENTITY_API_URL_ID, preferences.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(preferencesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore - 1);
    }

    @Test
    @Transactional
    void searchPreferences() throws Exception {
        // Initialize the database
        preferences = preferencesRepository.saveAndFlush(preferences);
        preferencesSearchRepository.save(preferences);

        // Search the preferences
        restPreferencesMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].weeklyGoal").value(hasItem(DEFAULT_WEEKLY_GOAL)))
            .andExpect(jsonPath("$.[*].weightUnits").value(hasItem(DEFAULT_WEIGHT_UNITS.toString())));
    }

    protected long getRepositoryCount() {
        return preferencesRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Preferences getPersistedPreferences(Preferences preferences) {
        return preferencesRepository.findById(preferences.getId()).orElseThrow();
    }

    protected void assertPersistedPreferencesToMatchAllProperties(Preferences expectedPreferences) {
        assertPreferencesAllPropertiesEquals(expectedPreferences, getPersistedPreferences(expectedPreferences));
    }

    protected void assertPersistedPreferencesToMatchUpdatableProperties(Preferences expectedPreferences) {
        assertPreferencesAllUpdatablePropertiesEquals(expectedPreferences, getPersistedPreferences(expectedPreferences));
    }
}

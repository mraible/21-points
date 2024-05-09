package org.jhipster.health.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.hasItem;
import static org.jhipster.health.domain.BloodPressureAsserts.*;
import static org.jhipster.health.web.rest.TestUtil.createUpdateProxyForBean;
import static org.jhipster.health.web.rest.TestUtil.sameInstant;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.assertj.core.util.IterableUtil;
import org.jhipster.health.IntegrationTest;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
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
 * Integration tests for the {@link BloodPressureResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BloodPressureResourceIT {

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_SYSTOLIC = 1;
    private static final Integer UPDATED_SYSTOLIC = 2;

    private static final Integer DEFAULT_DIASTOLIC = 1;
    private static final Integer UPDATED_DIASTOLIC = 2;

    private static final String ENTITY_API_URL = "/api/blood-pressures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/blood-pressures/_search";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private BloodPressureRepository bloodPressureRepository;

    @Mock
    private BloodPressureRepository bloodPressureRepositoryMock;

    @Autowired
    private BloodPressureSearchRepository bloodPressureSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBloodPressureMockMvc;

    private BloodPressure bloodPressure;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BloodPressure createEntity(EntityManager em) {
        BloodPressure bloodPressure = new BloodPressure()
            .timestamp(DEFAULT_TIMESTAMP)
            .systolic(DEFAULT_SYSTOLIC)
            .diastolic(DEFAULT_DIASTOLIC);
        return bloodPressure;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BloodPressure createUpdatedEntity(EntityManager em) {
        BloodPressure bloodPressure = new BloodPressure()
            .timestamp(UPDATED_TIMESTAMP)
            .systolic(UPDATED_SYSTOLIC)
            .diastolic(UPDATED_DIASTOLIC);
        return bloodPressure;
    }

    @AfterEach
    public void cleanupElasticSearchRepository() {
        bloodPressureSearchRepository.deleteAll();
        assertThat(bloodPressureSearchRepository.count()).isEqualTo(0);
    }

    @BeforeEach
    public void initTest() {
        bloodPressure = createEntity(em);
    }

    @Test
    @Transactional
    void createBloodPressure() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        // Create the BloodPressure
        var returnedBloodPressure = om.readValue(
            restBloodPressureMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bloodPressure)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            BloodPressure.class
        );

        // Validate the BloodPressure in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertBloodPressureUpdatableFieldsEquals(returnedBloodPressure, getPersistedBloodPressure(returnedBloodPressure));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore + 1);
            });
    }

    @Test
    @Transactional
    void createBloodPressureWithExistingId() throws Exception {
        // Create the BloodPressure with an existing ID
        bloodPressure.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());

        // An entity with an existing ID cannot be created, so this API call must fail
        restBloodPressureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkTimestampIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        // set the field null
        bloodPressure.setTimestamp(null);

        // Create the BloodPressure, which fails.

        restBloodPressureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkSystolicIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        // set the field null
        bloodPressure.setSystolic(null);

        // Create the BloodPressure, which fails.

        restBloodPressureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkDiastolicIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        // set the field null
        bloodPressure.setDiastolic(null);

        // Create the BloodPressure, which fails.

        restBloodPressureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void getAllBloodPressures() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        // Get all the bloodPressureList
        restBloodPressureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodPressure.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBloodPressuresWithEagerRelationshipsIsEnabled() throws Exception {
        when(bloodPressureRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBloodPressureMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bloodPressureRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBloodPressuresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(bloodPressureRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBloodPressureMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(bloodPressureRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        // Get the bloodPressure
        restBloodPressureMockMvc
            .perform(get(ENTITY_API_URL_ID, bloodPressure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bloodPressure.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(sameInstant(DEFAULT_TIMESTAMP)))
            .andExpect(jsonPath("$.systolic").value(DEFAULT_SYSTOLIC))
            .andExpect(jsonPath("$.diastolic").value(DEFAULT_DIASTOLIC));
    }

    @Test
    @Transactional
    void getNonExistingBloodPressure() throws Exception {
        // Get the bloodPressure
        restBloodPressureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        long databaseSizeBeforeUpdate = getRepositoryCount();
        bloodPressureSearchRepository.save(bloodPressure);
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());

        // Update the bloodPressure
        BloodPressure updatedBloodPressure = bloodPressureRepository.findById(bloodPressure.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBloodPressure are not directly saved in db
        em.detach(updatedBloodPressure);
        updatedBloodPressure.timestamp(UPDATED_TIMESTAMP).systolic(UPDATED_SYSTOLIC).diastolic(UPDATED_DIASTOLIC);

        restBloodPressureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBloodPressure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedBloodPressure))
            )
            .andExpect(status().isOk());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedBloodPressureToMatchAllProperties(updatedBloodPressure);

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
                List<BloodPressure> bloodPressureSearchList = Streamable.of(bloodPressureSearchRepository.findAll()).toList();
                BloodPressure testBloodPressureSearch = bloodPressureSearchList.get(searchDatabaseSizeAfter - 1);

                assertBloodPressureAllPropertiesEquals(testBloodPressureSearch, updatedBloodPressure);
            });
    }

    @Test
    @Transactional
    void putNonExistingBloodPressure() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        bloodPressure.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloodPressureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bloodPressure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bloodPressure))
            )
            .andExpect(status().isBadRequest());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithIdMismatchBloodPressure() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        bloodPressure.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloodPressureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bloodPressure))
            )
            .andExpect(status().isBadRequest());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBloodPressure() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        bloodPressure.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloodPressureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bloodPressure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void partialUpdateBloodPressureWithPatch() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bloodPressure using partial update
        BloodPressure partialUpdatedBloodPressure = new BloodPressure();
        partialUpdatedBloodPressure.setId(bloodPressure.getId());

        partialUpdatedBloodPressure.timestamp(UPDATED_TIMESTAMP).systolic(UPDATED_SYSTOLIC).diastolic(UPDATED_DIASTOLIC);

        restBloodPressureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBloodPressure.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBloodPressure))
            )
            .andExpect(status().isOk());

        // Validate the BloodPressure in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBloodPressureUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedBloodPressure, bloodPressure),
            getPersistedBloodPressure(bloodPressure)
        );
    }

    @Test
    @Transactional
    void fullUpdateBloodPressureWithPatch() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bloodPressure using partial update
        BloodPressure partialUpdatedBloodPressure = new BloodPressure();
        partialUpdatedBloodPressure.setId(bloodPressure.getId());

        partialUpdatedBloodPressure.timestamp(UPDATED_TIMESTAMP).systolic(UPDATED_SYSTOLIC).diastolic(UPDATED_DIASTOLIC);

        restBloodPressureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBloodPressure.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBloodPressure))
            )
            .andExpect(status().isOk());

        // Validate the BloodPressure in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBloodPressureUpdatableFieldsEquals(partialUpdatedBloodPressure, getPersistedBloodPressure(partialUpdatedBloodPressure));
    }

    @Test
    @Transactional
    void patchNonExistingBloodPressure() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        bloodPressure.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloodPressureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bloodPressure.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bloodPressure))
            )
            .andExpect(status().isBadRequest());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBloodPressure() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        bloodPressure.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloodPressureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bloodPressure))
            )
            .andExpect(status().isBadRequest());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBloodPressure() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        bloodPressure.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBloodPressureMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(bloodPressure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BloodPressure in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void deleteBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressureRepository.save(bloodPressure);
        bloodPressureSearchRepository.save(bloodPressure);

        long databaseSizeBeforeDelete = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeBefore).isEqualTo(databaseSizeBeforeDelete);

        // Delete the bloodPressure
        restBloodPressureMockMvc
            .perform(delete(ENTITY_API_URL_ID, bloodPressure.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(bloodPressureSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore - 1);
    }

    @Test
    @Transactional
    void searchBloodPressure() throws Exception {
        // Initialize the database
        bloodPressure = bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressureSearchRepository.save(bloodPressure);

        // Search the bloodPressure
        restBloodPressureMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + bloodPressure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodPressure.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    protected long getRepositoryCount() {
        return bloodPressureRepository.count();
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

    protected BloodPressure getPersistedBloodPressure(BloodPressure bloodPressure) {
        return bloodPressureRepository.findById(bloodPressure.getId()).orElseThrow();
    }

    protected void assertPersistedBloodPressureToMatchAllProperties(BloodPressure expectedBloodPressure) {
        assertBloodPressureAllPropertiesEquals(expectedBloodPressure, getPersistedBloodPressure(expectedBloodPressure));
    }

    protected void assertPersistedBloodPressureToMatchUpdatableProperties(BloodPressure expectedBloodPressure) {
        assertBloodPressureAllUpdatablePropertiesEquals(expectedBloodPressure, getPersistedBloodPressure(expectedBloodPressure));
    }
}

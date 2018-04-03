package org.jhipster.health.web.rest;

import org.jhipster.health.TwentyOnePointsApp;

import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
import org.jhipster.health.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static org.jhipster.health.web.rest.TestUtil.sameInstant;
import static org.jhipster.health.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BloodPressureResource REST controller.
 *
 * @see BloodPressureResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TwentyOnePointsApp.class)
public class BloodPressureResourceIntTest {

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_SYSTOLIC = 1;
    private static final Integer UPDATED_SYSTOLIC = 2;

    private static final Integer DEFAULT_DIASTOLIC = 1;
    private static final Integer UPDATED_DIASTOLIC = 2;

    @Autowired
    private BloodPressureRepository bloodPressureRepository;

    @Autowired
    private BloodPressureSearchRepository bloodPressureSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restBloodPressureMockMvc;

    private BloodPressure bloodPressure;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BloodPressureResource bloodPressureResource = new BloodPressureResource(bloodPressureRepository, bloodPressureSearchRepository);
        this.restBloodPressureMockMvc = MockMvcBuilders.standaloneSetup(bloodPressureResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

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

    @Before
    public void initTest() {
        bloodPressureSearchRepository.deleteAll();
        bloodPressure = createEntity(em);
    }

    @Test
    @Transactional
    public void createBloodPressure() throws Exception {
        int databaseSizeBeforeCreate = bloodPressureRepository.findAll().size();

        // Create the BloodPressure
        restBloodPressureMockMvc.perform(post("/api/blood-pressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isCreated());

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeCreate + 1);
        BloodPressure testBloodPressure = bloodPressureList.get(bloodPressureList.size() - 1);
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(DEFAULT_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(DEFAULT_DIASTOLIC);

        // Validate the BloodPressure in Elasticsearch
        BloodPressure bloodPressureEs = bloodPressureSearchRepository.findOne(testBloodPressure.getId());
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(testBloodPressure.getTimestamp());
        assertThat(bloodPressureEs).isEqualToIgnoringGivenFields(testBloodPressure, "timestamp");
    }

    @Test
    @Transactional
    public void createBloodPressureWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bloodPressureRepository.findAll().size();

        // Create the BloodPressure with an existing ID
        bloodPressure.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBloodPressureMockMvc.perform(post("/api/blood-pressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().size();
        // set the field null
        bloodPressure.setTimestamp(null);

        // Create the BloodPressure, which fails.

        restBloodPressureMockMvc.perform(post("/api/blood-pressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSystolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().size();
        // set the field null
        bloodPressure.setSystolic(null);

        // Create the BloodPressure, which fails.

        restBloodPressureMockMvc.perform(post("/api/blood-pressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDiastolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().size();
        // set the field null
        bloodPressure.setDiastolic(null);

        // Create the BloodPressure, which fails.

        restBloodPressureMockMvc.perform(post("/api/blood-pressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBloodPressures() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        // Get all the bloodPressureList
        restBloodPressureMockMvc.perform(get("/api/blood-pressures?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodPressure.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    @Test
    @Transactional
    public void getBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        // Get the bloodPressure
        restBloodPressureMockMvc.perform(get("/api/blood-pressures/{id}", bloodPressure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(bloodPressure.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(sameInstant(DEFAULT_TIMESTAMP)))
            .andExpect(jsonPath("$.systolic").value(DEFAULT_SYSTOLIC))
            .andExpect(jsonPath("$.diastolic").value(DEFAULT_DIASTOLIC));
    }

    @Test
    @Transactional
    public void getNonExistingBloodPressure() throws Exception {
        // Get the bloodPressure
        restBloodPressureMockMvc.perform(get("/api/blood-pressures/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressureSearchRepository.save(bloodPressure);
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().size();

        // Update the bloodPressure
        BloodPressure updatedBloodPressure = bloodPressureRepository.findOne(bloodPressure.getId());
        // Disconnect from session so that the updates on updatedBloodPressure are not directly saved in db
        em.detach(updatedBloodPressure);
        updatedBloodPressure
            .timestamp(UPDATED_TIMESTAMP)
            .systolic(UPDATED_SYSTOLIC)
            .diastolic(UPDATED_DIASTOLIC);

        restBloodPressureMockMvc.perform(put("/api/blood-pressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBloodPressure)))
            .andExpect(status().isOk());

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
        BloodPressure testBloodPressure = bloodPressureList.get(bloodPressureList.size() - 1);
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(UPDATED_DIASTOLIC);

        // Validate the BloodPressure in Elasticsearch
        BloodPressure bloodPressureEs = bloodPressureSearchRepository.findOne(testBloodPressure.getId());
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(testBloodPressure.getTimestamp());
        assertThat(bloodPressureEs).isEqualToIgnoringGivenFields(testBloodPressure, "timestamp");
    }

    @Test
    @Transactional
    public void updateNonExistingBloodPressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().size();

        // Create the BloodPressure

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restBloodPressureMockMvc.perform(put("/api/blood-pressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isCreated());

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressureSearchRepository.save(bloodPressure);
        int databaseSizeBeforeDelete = bloodPressureRepository.findAll().size();

        // Get the bloodPressure
        restBloodPressureMockMvc.perform(delete("/api/blood-pressures/{id}", bloodPressure.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean bloodPressureExistsInEs = bloodPressureSearchRepository.exists(bloodPressure.getId());
        assertThat(bloodPressureExistsInEs).isFalse();

        // Validate the database is empty
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressureSearchRepository.save(bloodPressure);

        // Search the bloodPressure
        restBloodPressureMockMvc.perform(get("/api/_search/blood-pressures?query=id:" + bloodPressure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodPressure.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BloodPressure.class);
        BloodPressure bloodPressure1 = new BloodPressure();
        bloodPressure1.setId(1L);
        BloodPressure bloodPressure2 = new BloodPressure();
        bloodPressure2.setId(bloodPressure1.getId());
        assertThat(bloodPressure1).isEqualTo(bloodPressure2);
        bloodPressure2.setId(2L);
        assertThat(bloodPressure1).isNotEqualTo(bloodPressure2);
        bloodPressure1.setId(null);
        assertThat(bloodPressure1).isNotEqualTo(bloodPressure2);
    }
}

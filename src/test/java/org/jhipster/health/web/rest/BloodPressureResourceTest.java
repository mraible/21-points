package org.jhipster.health.web.rest;

import org.jhipster.health.Application;
import org.jhipster.health.domain.BloodPressure;
import org.jhipster.health.domain.User;
import org.jhipster.health.repository.BloodPressureRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.BloodPressureSearchRepository;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the BloodPressureResource REST controller.
 *
 * @see BloodPressureResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class BloodPressureResourceTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    private static final DateTime DEFAULT_TIMESTAMP = new DateTime(0L, DateTimeZone.UTC);
    private static final DateTime UPDATED_TIMESTAMP = new DateTime(DateTimeZone.UTC).withMillisOfSecond(0);
    private static final String DEFAULT_TIMESTAMP_STR = dateTimeFormatter.print(DEFAULT_TIMESTAMP);

    private static final Integer DEFAULT_SYSTOLIC = 1;
    private static final Integer UPDATED_SYSTOLIC = 2;

    private static final Integer DEFAULT_DIASTOLIC = 1;
    private static final Integer UPDATED_DIASTOLIC = 2;

    @Inject
    private BloodPressureRepository bloodPressureRepository;

    @Inject
    private BloodPressureSearchRepository bloodPressureSearchRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restBloodPressureMockMvc;

    private BloodPressure bloodPressure;

    @Autowired
    private WebApplicationContext context;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        BloodPressureResource bloodPressureResource = new BloodPressureResource();
        ReflectionTestUtils.setField(bloodPressureResource, "bloodPressureRepository", bloodPressureRepository);
        ReflectionTestUtils.setField(bloodPressureResource, "bloodPressureSearchRepository", bloodPressureSearchRepository);
        ReflectionTestUtils.setField(bloodPressureResource, "userRepository", userRepository);
        this.restBloodPressureMockMvc = MockMvcBuilders.standaloneSetup(bloodPressureResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        bloodPressure = new BloodPressure();
        bloodPressure.setTimestamp(DEFAULT_TIMESTAMP);
        bloodPressure.setSystolic(DEFAULT_SYSTOLIC);
        bloodPressure.setDiastolic(DEFAULT_DIASTOLIC);
    }

    @Test
    @Transactional
    public void createBloodPressure() throws Exception {
        int databaseSizeBeforeCreate = bloodPressureRepository.findAll().size();

        // create security-aware mockMvc
        restBloodPressureMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Create the BloodPressure
        restBloodPressureMockMvc.perform(post("/api/bloodPressures")
            .with(user("user"))
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isCreated());

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressures = bloodPressureRepository.findAll();
        assertThat(bloodPressures).hasSize(databaseSizeBeforeCreate + 1);
        BloodPressure testBloodPressure = bloodPressures.get(bloodPressures.size() - 1);
        assertThat(testBloodPressure.getTimestamp().toDateTime(DateTimeZone.UTC)).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(DEFAULT_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(DEFAULT_DIASTOLIC);
    }

    @Test
    @Transactional
    public void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().size();
        // set the field null
        bloodPressure.setTimestamp(null);

        // Create the BloodPressure, which fails.
        restBloodPressureMockMvc.perform(post("/api/bloodPressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        List<BloodPressure> bloodPressures = bloodPressureRepository.findAll();
        assertThat(bloodPressures).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSystolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().size();
        // set the field null
        bloodPressure.setSystolic(null);

        // Create the BloodPressure, which fails.
        restBloodPressureMockMvc.perform(post("/api/bloodPressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        List<BloodPressure> bloodPressures = bloodPressureRepository.findAll();
        assertThat(bloodPressures).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDiastolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().size();
        // set the field null
        bloodPressure.setDiastolic(null);

        // Create the BloodPressure, which fails.
        restBloodPressureMockMvc.perform(post("/api/bloodPressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isBadRequest());

        List<BloodPressure> bloodPressures = bloodPressureRepository.findAll();
        assertThat(bloodPressures).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", roles = "ADMIN")
    public void getAllBloodPressures() throws Exception {
        // Setup security
        bloodPressureRepository.saveAndFlush(bloodPressure);

        restBloodPressureMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the bloodPressures
        restBloodPressureMockMvc.perform(get("/api/bloodPressures")
            .with(user("admin").roles("ADMIN")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodPressure.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP_STR)))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    @Test
    @Transactional
    public void getBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        // Get the bloodPressure
        restBloodPressureMockMvc.perform(get("/api/bloodPressures/{id}", bloodPressure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(bloodPressure.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP_STR))
            .andExpect(jsonPath("$.systolic").value(DEFAULT_SYSTOLIC))
            .andExpect(jsonPath("$.diastolic").value(DEFAULT_DIASTOLIC));
    }

    @Test
    @Transactional
    public void getNonExistingBloodPressure() throws Exception {
        // Get the bloodPressure
        restBloodPressureMockMvc.perform(get("/api/bloodPressures/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().size();

        // Update the bloodPressure
        bloodPressure.setTimestamp(UPDATED_TIMESTAMP);
        bloodPressure.setSystolic(UPDATED_SYSTOLIC);
        bloodPressure.setDiastolic(UPDATED_DIASTOLIC);


        restBloodPressureMockMvc.perform(put("/api/bloodPressures")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPressure)))
            .andExpect(status().isOk());

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressures = bloodPressureRepository.findAll();
        assertThat(bloodPressures).hasSize(databaseSizeBeforeUpdate);
        BloodPressure testBloodPressure = bloodPressures.get(bloodPressures.size() - 1);
        assertThat(testBloodPressure.getTimestamp().toDateTime(DateTimeZone.UTC)).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(UPDATED_DIASTOLIC);
    }

    @Test
    @Transactional
    public void deleteBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.saveAndFlush(bloodPressure);

        int databaseSizeBeforeDelete = bloodPressureRepository.findAll().size();

        // Get the bloodPressure
        restBloodPressureMockMvc.perform(delete("/api/bloodPressures/{id}", bloodPressure.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<BloodPressure> bloodPressures = bloodPressureRepository.findAll();
        assertThat(bloodPressures).hasSize(databaseSizeBeforeDelete - 1);
    }

    private void createBloodPressureByMonth(DateTime firstOfMonth, DateTime firstDayOfLastMonth) {
        User user = userRepository.findOneByLogin("user").get();
        // this month
        bloodPressure = new BloodPressure(firstOfMonth, 120, 80, user);
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressure = new BloodPressure(firstOfMonth.plusDays(10), 125, 75, user);
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressure = new BloodPressure(firstOfMonth.plusDays(20), 100, 69, user);
        bloodPressureRepository.saveAndFlush(bloodPressure);

        // last month
        bloodPressure = new BloodPressure(firstDayOfLastMonth, 130, 90, user);
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressure = new BloodPressure(firstDayOfLastMonth.plusDays(11), 135, 85, user);
        bloodPressureRepository.saveAndFlush(bloodPressure);
        bloodPressure = new BloodPressure(firstDayOfLastMonth.plusDays(23), 130, 75, user);
        bloodPressureRepository.saveAndFlush(bloodPressure);
    }

    @Test
    @Transactional
    public void getBloodPressureForLast30Days() throws Exception {
        DateTime now = new DateTime();
        DateTime firstOfMonth = now.withDayOfMonth(1);
        DateTime firstDayOfLastMonth = firstOfMonth.minusMonths(1);
        createBloodPressureByMonth(firstOfMonth, firstDayOfLastMonth);

        // create security-aware mockMvc
        restBloodPressureMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the blood pressure readings
        restBloodPressureMockMvc.perform(get("/api/bloodPressures")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(6)));

        // Get the blood pressure readings for the last 30 days
        restBloodPressureMockMvc.perform(get("/api/bp-by-days/{days}", 30)
            .with(user("user").roles("USER")))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.period").value("Last 30 Days"))
            .andExpect(jsonPath("$.readings.[*].systolic").value(hasItem(120)))
            .andExpect(jsonPath("$.readings.[*].diastolic").value(hasItem(69)));
    }

    @Test
    @Transactional
    public void getBloodPressureByMonth() throws Exception {
        DateTime now = new DateTime();
        DateTime firstOfMonth = now.withDayOfMonth(1);
        DateTime firstDayOfLastMonth = firstOfMonth.minusMonths(1);
        createBloodPressureByMonth(firstOfMonth, firstDayOfLastMonth);

        // create security-aware mockMvc
        restBloodPressureMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        DateTimeFormatter fmt = org.joda.time.format.DateTimeFormat.forPattern("yyyy-MM");

        // Get the points for last week
        restBloodPressureMockMvc.perform(get("/api/bp-by-month/{yearAndMonth}", fmt.print(firstDayOfLastMonth))
            .with(user("user").roles("USER")))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.period").value(fmt.print(firstDayOfLastMonth)))
            .andExpect(jsonPath("$.readings.[*].systolic").value(hasItem(130)))
            .andExpect(jsonPath("$.readings.[*].diastolic").value(hasItem(90)));
    }
}

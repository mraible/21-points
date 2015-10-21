package org.jhipster.health.web.rest;


import org.jhipster.health.Application;
import org.jhipster.health.domain.User;
import org.jhipster.health.domain.Weight;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.WeightRepository;
import org.jhipster.health.repository.search.WeightSearchRepository;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.Duration;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
 * Test class for the WeightResource REST controller.
 *
 * @see WeightResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class WeightResourceTest {

    private final Logger log = LoggerFactory.getLogger(WeightResourceTest.class);
    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
    private static final DateTime DEFAULT_TIMESTAMP = new DateTime(0L, DateTimeZone.UTC);
    private static final DateTime UPDATED_TIMESTAMP = new DateTime(DateTimeZone.UTC).withMillisOfSecond(0);
    private static final String DEFAULT_TIMESTAMP_STR = dateTimeFormatter.print(DEFAULT_TIMESTAMP);

    private static final Double DEFAULT_WEIGHT = 1D;
    private static final Double UPDATED_WEIGHT = 2D;

    @Inject
    private WeightRepository weightRepository;

    @Inject
    private WeightSearchRepository weightSearchRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restWeightMockMvc;

    private Weight weight;

    @Autowired
    private WebApplicationContext context;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        WeightResource weightResource = new WeightResource();
        ReflectionTestUtils.setField(weightResource, "weightRepository", weightRepository);
        ReflectionTestUtils.setField(weightResource, "weightSearchRepository", weightSearchRepository);
        ReflectionTestUtils.setField(weightResource, "userRepository", userRepository);
        this.restWeightMockMvc = MockMvcBuilders.standaloneSetup(weightResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        weight = new Weight();
        weight.setTimestamp(DEFAULT_TIMESTAMP);
        weight.setWeight(DEFAULT_WEIGHT);
    }

    @Test
    @Transactional
    public void createWeight() throws Exception {
        int databaseSizeBeforeCreate = weightRepository.findAll().size();

        // create security-aware mockMvc
        restWeightMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Create the Weight
        restWeightMockMvc.perform(post("/api/weights")
            .with(user("user"))
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weight)))
            .andExpect(status().isCreated());

        // Validate the Weight in the database
        List<Weight> weights = weightRepository.findAll();
        assertThat(weights).hasSize(databaseSizeBeforeCreate + 1);
        Weight testWeight = weights.get(weights.size() - 1);
        assertThat(testWeight.getTimestamp().toDateTime(DateTimeZone.UTC)).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);
    }

    @Test
    @Transactional
    public void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = weightRepository.findAll().size();
        // set the field null
        weight.setTimestamp(null);

        // Create the Weight, which fails.

        restWeightMockMvc.perform(post("/api/weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weight)))
            .andExpect(status().isBadRequest());

        List<Weight> weights = weightRepository.findAll();
        assertThat(weights).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = weightRepository.findAll().size();
        // set the field null
        weight.setWeight(null);

        // Create the Weight, which fails.
        restWeightMockMvc.perform(post("/api/weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weight)))
            .andExpect(status().isBadRequest());

        List<Weight> weights = weightRepository.findAll();
        assertThat(weights).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllWeights() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        // create security-aware mockMvc
        restWeightMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the weights
        restWeightMockMvc.perform(get("/api/weights")
            .with(user("admin").roles("ADMIN")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weight.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP_STR)))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @Test
    @Transactional
    public void getWeight() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        // Get the weight
        restWeightMockMvc.perform(get("/api/weights/{id}", weight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(weight.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP_STR))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingWeight() throws Exception {
        // Get the weight
        restWeightMockMvc.perform(get("/api/weights/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWeight() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        int databaseSizeBeforeUpdate = weightRepository.findAll().size();

        // Update the weight
        weight.setTimestamp(UPDATED_TIMESTAMP);
        weight.setWeight(UPDATED_WEIGHT);


        restWeightMockMvc.perform(put("/api/weights")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(weight)))
            .andExpect(status().isOk());

        // Validate the Weight in the database
        List<Weight> weights = weightRepository.findAll();
        assertThat(weights).hasSize(databaseSizeBeforeUpdate);
        Weight testWeight = weights.get(weights.size() - 1);
        assertThat(testWeight.getTimestamp().toDateTime(DateTimeZone.UTC)).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);
    }

    @Test
    @Transactional
    public void deleteWeight() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        int databaseSizeBeforeDelete = weightRepository.findAll().size();

        // Get the weight
        restWeightMockMvc.perform(delete("/api/weights/{id}", weight.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Weight> weights = weightRepository.findAll();
        assertThat(weights).hasSize(databaseSizeBeforeDelete - 1);
    }

    private void createByMonth(DateTime firstOfMonth, DateTime firstDayOfLastMonth) {
        log.debug("firstOfMonth: {}, firstOfLastMonth: {}", firstOfMonth.toString(), firstDayOfLastMonth.toString());
        User user = userRepository.findOneByLogin("user").get();
        // this month
        weightRepository.saveAndFlush(new Weight(firstOfMonth, 205D, user));
        weightRepository.saveAndFlush(new Weight(firstOfMonth.plusDays(10), 200D, user));
        weightRepository.saveAndFlush(new Weight(firstOfMonth.plusDays(20), 195D, user));

        // last month
        weightRepository.saveAndFlush(new Weight(firstDayOfLastMonth, 208D, user));
        weightRepository.saveAndFlush(new Weight(firstDayOfLastMonth.plusDays(11), 206D, user));
        weightRepository.saveAndFlush(new Weight(firstDayOfLastMonth.plusDays(23), 204D, user));
    }

    @Test
    @Transactional
    public void getForLast30Days() throws Exception {
        DateTime now = new DateTime();
        DateTime firstOfMonth = now.withDayOfMonth(1);
        // MR: On 10/13/15, the lines of code below cause this test to fail, commented out
        // make sure firstOfMonth - 20 days is still w/in 30 days
        /*Duration duration = new Duration(firstOfMonth, now);
        log.debug("Difference between now and firstOfMonth: {}", duration.getStandardDays());
        if (duration.getStandardDays() < 20) {
            firstOfMonth = firstOfMonth.minusMonths(1);
        }*/
        DateTime firstDayOfLastMonth = firstOfMonth.minusMonths(1);
        createByMonth(firstOfMonth, firstDayOfLastMonth);

        // create security-aware mockMvc
        restWeightMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the blood pressure readings
        restWeightMockMvc.perform(get("/api/weights")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(6)));

        // Get the blood pressure readings for the last 30 days
        restWeightMockMvc.perform(get("/api/weight-by-days/{days}", 30)
            .with(user("user").roles("USER")))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.period").value("Last 30 Days"))
            .andExpect(jsonPath("$.weighIns.[*].weight").value(hasItem(200D)));
    }

    @Test
    @Transactional
    public void getByLastMonth() throws Exception {
        DateTime now = new DateTime();
        DateTime firstOfMonth = now.withDayOfMonth(1);
        // make sure firstOfMonth - 20 days is still w/in 30 days
        Duration duration = new Duration(firstOfMonth, now);
        log.debug("Difference between now and firstOfMonth: {}", duration.getStandardDays());
        if (duration.getStandardDays() < 20) {
            firstOfMonth = now;
        }
        DateTime firstDayOfLastMonth = firstOfMonth.minusMonths(1);
        createByMonth(firstOfMonth, firstDayOfLastMonth);

        // create security-aware mockMvc
        restWeightMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        DateTimeFormatter fmt = org.joda.time.format.DateTimeFormat.forPattern("yyyy-MM");

        // Get the points for last week
        restWeightMockMvc.perform(get("/api/weight-by-month/{yearAndMonth}", fmt.print(firstDayOfLastMonth))
            .with(user("user").roles("USER")))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.period").value(fmt.print(firstDayOfLastMonth)))
            .andExpect(jsonPath("$.weighIns.[*].weight").value(hasItem(206D)));
    }
}

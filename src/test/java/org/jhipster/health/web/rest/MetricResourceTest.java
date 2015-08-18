package org.jhipster.health.web.rest;

import org.jhipster.health.Application;
import org.jhipster.health.domain.Metric;
import org.jhipster.health.repository.MetricRepository;
import org.jhipster.health.repository.search.MetricSearchRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
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

/**
 * Test class for the MetricResource REST controller.
 *
 * @see MetricResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class MetricResourceTest {

    private static final String DEFAULT_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_NAME = "UPDATED_TEXT";
    private static final String DEFAULT_AMOUNT = "SAMPLE_TEXT";
    private static final String UPDATED_AMOUNT = "UPDATED_TEXT";

    @Inject
    private MetricRepository metricRepository;

    @Inject
    private MetricSearchRepository metricSearchRepository;

    private MockMvc restMetricMockMvc;

    private Metric metric;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        MetricResource metricResource = new MetricResource();
        ReflectionTestUtils.setField(metricResource, "metricRepository", metricRepository);
        ReflectionTestUtils.setField(metricResource, "metricSearchRepository", metricSearchRepository);
        this.restMetricMockMvc = MockMvcBuilders.standaloneSetup(metricResource).build();
    }

    @Before
    public void initTest() {
        metric = new Metric();
        metric.setName(DEFAULT_NAME);
        metric.setAmount(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    public void createMetric() throws Exception {
        int databaseSizeBeforeCreate = metricRepository.findAll().size();

        // Create the Metric
        restMetricMockMvc.perform(post("/api/metrics")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(metric)))
                .andExpect(status().isCreated());

        // Validate the Metric in the database
        List<Metric> metrics = metricRepository.findAll();
        assertThat(metrics).hasSize(databaseSizeBeforeCreate + 1);
        Metric testMetric = metrics.get(metrics.size() - 1);
        assertThat(testMetric.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMetric.getAmount()).isEqualTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(metricRepository.findAll()).hasSize(0);
        // set the field null
        metric.setName(null);

        // Create the Metric, which fails.
        restMetricMockMvc.perform(post("/api/metrics")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(metric)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<Metric> metrics = metricRepository.findAll();
        assertThat(metrics).hasSize(0);
    }

    @Test
    @Transactional
    public void checkAmountIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(metricRepository.findAll()).hasSize(0);
        // set the field null
        metric.setAmount(null);

        // Create the Metric, which fails.
        restMetricMockMvc.perform(post("/api/metrics")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(metric)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<Metric> metrics = metricRepository.findAll();
        assertThat(metrics).hasSize(0);
    }

    @Test
    @Transactional
    public void getAllMetrics() throws Exception {
        // Initialize the database
        metricRepository.saveAndFlush(metric);

        // Get all the metrics
        restMetricMockMvc.perform(get("/api/metrics"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(metric.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.toString())));
    }

    @Test
    @Transactional
    public void getMetric() throws Exception {
        // Initialize the database
        metricRepository.saveAndFlush(metric);

        // Get the metric
        restMetricMockMvc.perform(get("/api/metrics/{id}", metric.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(metric.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMetric() throws Exception {
        // Get the metric
        restMetricMockMvc.perform(get("/api/metrics/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMetric() throws Exception {
        // Initialize the database
        metricRepository.saveAndFlush(metric);

		int databaseSizeBeforeUpdate = metricRepository.findAll().size();

        // Update the metric
        metric.setName(UPDATED_NAME);
        metric.setAmount(UPDATED_AMOUNT);
        restMetricMockMvc.perform(put("/api/metrics")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(metric)))
                .andExpect(status().isOk());

        // Validate the Metric in the database
        List<Metric> metrics = metricRepository.findAll();
        assertThat(metrics).hasSize(databaseSizeBeforeUpdate);
        Metric testMetric = metrics.get(metrics.size() - 1);
        assertThat(testMetric.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMetric.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    public void deleteMetric() throws Exception {
        // Initialize the database
        metricRepository.saveAndFlush(metric);

		int databaseSizeBeforeDelete = metricRepository.findAll().size();

        // Get the metric
        restMetricMockMvc.perform(delete("/api/metrics/{id}", metric.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Metric> metrics = metricRepository.findAll();
        assertThat(metrics).hasSize(databaseSizeBeforeDelete - 1);
    }
}

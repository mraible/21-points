package org.jhipster.health.web.rest;

import org.jhipster.health.TwentyOnePointsApp;

import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
import org.jhipster.health.repository.search.PointsSearchRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.jhipster.health.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PointsResource REST controller.
 *
 * @see PointsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TwentyOnePointsApp.class)
public class PointsResourceIntTest {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_EXERCISE = 1;
    private static final Integer UPDATED_EXERCISE = 2;

    private static final Integer DEFAULT_MEALS = 1;
    private static final Integer UPDATED_MEALS = 2;

    private static final Integer DEFAULT_ALCOHOL = 1;
    private static final Integer UPDATED_ALCOHOL = 2;

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    @Autowired
    private PointsRepository pointsRepository;

    @Autowired
    private PointsSearchRepository pointsSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPointsMockMvc;

    private Points points;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PointsResource pointsResource = new PointsResource(pointsRepository, pointsSearchRepository);
        this.restPointsMockMvc = MockMvcBuilders.standaloneSetup(pointsResource)
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
    public static Points createEntity(EntityManager em) {
        Points points = new Points()
            .date(DEFAULT_DATE)
            .exercise(DEFAULT_EXERCISE)
            .meals(DEFAULT_MEALS)
            .alcohol(DEFAULT_ALCOHOL)
            .notes(DEFAULT_NOTES);
        return points;
    }

    @Before
    public void initTest() {
        pointsSearchRepository.deleteAll();
        points = createEntity(em);
    }

    @Test
    @Transactional
    public void createPoints() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // Create the Points
        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isCreated());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate + 1);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(DEFAULT_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(DEFAULT_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(DEFAULT_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(DEFAULT_NOTES);

        // Validate the Points in Elasticsearch
        Points pointsEs = pointsSearchRepository.findOne(testPoints.getId());
        assertThat(pointsEs).isEqualToIgnoringGivenFields(testPoints);
    }

    @Test
    @Transactional
    public void createPointsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // Create the Points with an existing ID
        points.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsRepository.findAll().size();
        // set the field null
        points.setDate(null);

        // Create the Points, which fails.

        restPointsMockMvc.perform(post("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Get all the pointsList
        restPointsMockMvc.perform(get("/api/points?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(points.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].exercise").value(hasItem(DEFAULT_EXERCISE)))
            .andExpect(jsonPath("$.[*].meals").value(hasItem(DEFAULT_MEALS)))
            .andExpect(jsonPath("$.[*].alcohol").value(hasItem(DEFAULT_ALCOHOL)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES.toString())));
    }

    @Test
    @Transactional
    public void getPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Get the points
        restPointsMockMvc.perform(get("/api/points/{id}", points.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(points.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.exercise").value(DEFAULT_EXERCISE))
            .andExpect(jsonPath("$.meals").value(DEFAULT_MEALS))
            .andExpect(jsonPath("$.alcohol").value(DEFAULT_ALCOHOL))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPoints() throws Exception {
        // Get the points
        restPointsMockMvc.perform(get("/api/points/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);
        pointsSearchRepository.save(points);
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Update the points
        Points updatedPoints = pointsRepository.findOne(points.getId());
        // Disconnect from session so that the updates on updatedPoints are not directly saved in db
        em.detach(updatedPoints);
        updatedPoints
            .date(UPDATED_DATE)
            .exercise(UPDATED_EXERCISE)
            .meals(UPDATED_MEALS)
            .alcohol(UPDATED_ALCOHOL)
            .notes(UPDATED_NOTES);

        restPointsMockMvc.perform(put("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPoints)))
            .andExpect(status().isOk());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(UPDATED_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(UPDATED_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(UPDATED_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(UPDATED_NOTES);

        // Validate the Points in Elasticsearch
        Points pointsEs = pointsSearchRepository.findOne(testPoints.getId());
        assertThat(pointsEs).isEqualToIgnoringGivenFields(testPoints);
    }

    @Test
    @Transactional
    public void updateNonExistingPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Create the Points

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPointsMockMvc.perform(put("/api/points")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isCreated());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);
        pointsSearchRepository.save(points);
        int databaseSizeBeforeDelete = pointsRepository.findAll().size();

        // Get the points
        restPointsMockMvc.perform(delete("/api/points/{id}", points.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean pointsExistsInEs = pointsSearchRepository.exists(points.getId());
        assertThat(pointsExistsInEs).isFalse();

        // Validate the database is empty
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);
        pointsSearchRepository.save(points);

        // Search the points
        restPointsMockMvc.perform(get("/api/_search/points?query=id:" + points.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(points.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].exercise").value(hasItem(DEFAULT_EXERCISE)))
            .andExpect(jsonPath("$.[*].meals").value(hasItem(DEFAULT_MEALS)))
            .andExpect(jsonPath("$.[*].alcohol").value(hasItem(DEFAULT_ALCOHOL)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Points.class);
        Points points1 = new Points();
        points1.setId(1L);
        Points points2 = new Points();
        points2.setId(points1.getId());
        assertThat(points1).isEqualTo(points2);
        points2.setId(2L);
        assertThat(points1).isNotEqualTo(points2);
        points1.setId(null);
        assertThat(points1).isNotEqualTo(points2);
    }
}

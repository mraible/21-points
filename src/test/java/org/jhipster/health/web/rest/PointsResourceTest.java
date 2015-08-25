package org.jhipster.health.web.rest;

import org.jhipster.health.Application;
import org.jhipster.health.domain.Points;
import org.jhipster.health.domain.User;
import org.jhipster.health.repository.PointsRepository;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.search.PointsSearchRepository;
import org.joda.time.DateTimeConstants;
import org.joda.time.LocalDate;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the PointsResource REST controller.
 *
 * @see PointsResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class PointsResourceTest {

    private static final LocalDate DEFAULT_DATE = new LocalDate(0L);
    private static final LocalDate UPDATED_DATE = new LocalDate();

    private static final Integer DEFAULT_EXERCISE = 1;
    private static final Integer UPDATED_EXERCISE = 2;

    private static final Integer DEFAULT_MEALS = 1;
    private static final Integer UPDATED_MEALS = 2;

    private static final Integer DEFAULT_ALCOHOL = 1;
    private static final Integer UPDATED_ALCOHOL = 2;
    private static final String DEFAULT_NOTES = "SAMPLE_TEXT";
    private static final String UPDATED_NOTES = "UPDATED_TEXT";

    @Inject
    private PointsRepository pointsRepository;

    @Inject
    private PointsSearchRepository pointsSearchRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restPointsMockMvc;

    private Points points;

    @Autowired
    private WebApplicationContext context;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PointsResource pointsResource = new PointsResource();
        ReflectionTestUtils.setField(pointsResource, "pointsRepository", pointsRepository);
        ReflectionTestUtils.setField(pointsResource, "pointsSearchRepository", pointsSearchRepository);
        ReflectionTestUtils.setField(pointsResource, "userRepository", userRepository);
        this.restPointsMockMvc = MockMvcBuilders.standaloneSetup(pointsResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        points = new Points();
        points.setDate(DEFAULT_DATE);
        points.setExercise(DEFAULT_EXERCISE);
        points.setMeals(DEFAULT_MEALS);
        points.setAlcohol(DEFAULT_ALCOHOL);
        points.setNotes(DEFAULT_NOTES);
    }

    @Test
    @Transactional
    public void createPoints() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Create the Points
        restPointsMockMvc.perform(post("/api/points")
                .with(user("user"))
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(points)))
                .andExpect(status().isCreated());

        // Validate the Points in the database
        List<Points> points = pointsRepository.findAll();
        assertThat(points).hasSize(databaseSizeBeforeCreate + 1);
        Points testPoints = points.get(points.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(DEFAULT_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(DEFAULT_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(DEFAULT_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(DEFAULT_NOTES);
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

        List<Points> points = pointsRepository.findAll();
        assertThat(points).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the points
        restPointsMockMvc.perform(get("/api/points")
            .with(user("admin").roles("ADMIN")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
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
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
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

		int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Update the points
        points.setDate(UPDATED_DATE);
        points.setExercise(UPDATED_EXERCISE);
        points.setMeals(UPDATED_MEALS);
        points.setAlcohol(UPDATED_ALCOHOL);
        points.setNotes(UPDATED_NOTES);


        restPointsMockMvc.perform(put("/api/points")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(points)))
                .andExpect(status().isOk());

        // Validate the Points in the database
        List<Points> points = pointsRepository.findAll();
        assertThat(points).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = points.get(points.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(UPDATED_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(UPDATED_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(UPDATED_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    @Transactional
    public void deletePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

		int databaseSizeBeforeDelete = pointsRepository.findAll().size();

        // Get the points
        restPointsMockMvc.perform(delete("/api/points/{id}", points.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Points> points = pointsRepository.findAll();
        assertThat(points).hasSize(databaseSizeBeforeDelete - 1);
    }

    private void createPointsByWeek(LocalDate thisMonday, LocalDate lastMonday) {
        User user = userRepository.findOneByLogin("user").get();
        // Create points in two separate weeks
        points = new Points(thisMonday.plusDays(2), 1, 1, 1, user);
        pointsRepository.saveAndFlush(points);

        points = new Points(thisMonday.plusDays(3), 1, 1, 0, user);
        pointsRepository.saveAndFlush(points);

        points = new Points(lastMonday.plusDays(3), 0, 0, 1, user);
        pointsRepository.saveAndFlush(points);

        points = new Points(lastMonday.plusDays(4), 1, 1, 0, user);
        pointsRepository.saveAndFlush(points);
    }

    @Test
    @Transactional
    public void getPointsThisWeek() throws Exception {
        LocalDate today = new LocalDate();
        LocalDate thisMonday = today.withDayOfWeek(DateTimeConstants.MONDAY);
        LocalDate lastMonday = thisMonday.minusWeeks(1);
        createPointsByWeek(thisMonday, lastMonday);

        // create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the points
        restPointsMockMvc.perform(get("/api/points")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(4)));

        // Get the points for this week only
        restPointsMockMvc.perform(get("/api/points-this-week")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.week").value(thisMonday.toString()))
            .andExpect(jsonPath("$.points").value(5));
    }

    @Test
    @Transactional
    public void getPointsByWeek() throws Exception {
        LocalDate today = new LocalDate();
        LocalDate aMonday = today.minusMonths(2).withDayOfWeek(DateTimeConstants.MONDAY);
        LocalDate aPreviousMonday = aMonday.minusWeeks(2);
        createPointsByWeek(aMonday, aPreviousMonday);

        // create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get the points for last week
        restPointsMockMvc.perform(get("/api/points-by-week/{startDate}", aPreviousMonday.toString())
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.week").value(aPreviousMonday.toString()))
            .andExpect(jsonPath("$.points").value(3));
    }

    @Test
    @Transactional
    public void getPointsOnSunday() throws Exception {
        LocalDate today = new LocalDate();
        LocalDate sunday = today.withDayOfWeek(DateTimeConstants.SUNDAY);
        User user = userRepository.findOneByLogin("user").get();
        points = new Points(sunday, 1, 1, 0, user);
        pointsRepository.saveAndFlush(points);

        // create security-aware mockMvc
        restPointsMockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // Get all the points
        restPointsMockMvc.perform(get("/api/points")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(1)));

        // Get the points for this week only
        restPointsMockMvc.perform(get("/api/points-this-week")
            .with(user("user").roles("USER")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.week").value(sunday.withDayOfWeek(DateTimeConstants.MONDAY).toString()))
            .andExpect(jsonPath("$.points").value(2));
    }
}

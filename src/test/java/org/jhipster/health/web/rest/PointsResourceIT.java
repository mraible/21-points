package org.jhipster.health.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.jhipster.health.IntegrationTest;
import org.jhipster.health.domain.Points;
import org.jhipster.health.repository.PointsRepository;
import org.jhipster.health.repository.search.PointsSearchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PointsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PointsResourceIT {

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

    private static final String ENTITY_API_URL = "/api/points";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/_search/points";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PointsRepository pointsRepository;

    /**
     * This repository is mocked in the org.jhipster.health.repository.search test package.
     *
     * @see org.jhipster.health.repository.search.PointsSearchRepositoryMockConfiguration
     */
    @Autowired
    private PointsSearchRepository mockPointsSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPointsMockMvc;

    private Points points;

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

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Points createUpdatedEntity(EntityManager em) {
        Points points = new Points()
            .date(UPDATED_DATE)
            .exercise(UPDATED_EXERCISE)
            .meals(UPDATED_MEALS)
            .alcohol(UPDATED_ALCOHOL)
            .notes(UPDATED_NOTES);
        return points;
    }

    @BeforeEach
    public void initTest() {
        points = createEntity(em);
    }

    @Test
    @Transactional
    void createPoints() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().size();
        // Create the Points
        restPointsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(points)))
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
        verify(mockPointsSearchRepository, times(1)).save(testPoints);
    }

    @Test
    @Transactional
    void createPointsWithExistingId() throws Exception {
        // Create the Points with an existing ID
        points.setId(1L);

        int databaseSizeBeforeCreate = pointsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsRepository.findAll().size();
        // set the field null
        points.setDate(null);

        // Create the Points, which fails.

        restPointsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isBadRequest());

        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Get all the pointsList
        restPointsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(points.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].exercise").value(hasItem(DEFAULT_EXERCISE)))
            .andExpect(jsonPath("$.[*].meals").value(hasItem(DEFAULT_MEALS)))
            .andExpect(jsonPath("$.[*].alcohol").value(hasItem(DEFAULT_ALCOHOL)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)));
    }

    @Test
    @Transactional
    void getPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        // Get the points
        restPointsMockMvc
            .perform(get(ENTITY_API_URL_ID, points.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(points.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.exercise").value(DEFAULT_EXERCISE))
            .andExpect(jsonPath("$.meals").value(DEFAULT_MEALS))
            .andExpect(jsonPath("$.alcohol").value(DEFAULT_ALCOHOL))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES));
    }

    @Test
    @Transactional
    void getNonExistingPoints() throws Exception {
        // Get the points
        restPointsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Update the points
        Points updatedPoints = pointsRepository.findById(points.getId()).get();
        // Disconnect from session so that the updates on updatedPoints are not directly saved in db
        em.detach(updatedPoints);
        updatedPoints.date(UPDATED_DATE).exercise(UPDATED_EXERCISE).meals(UPDATED_MEALS).alcohol(UPDATED_ALCOHOL).notes(UPDATED_NOTES);

        restPointsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPoints.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPoints))
            )
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
        verify(mockPointsSearchRepository).save(testPoints);
    }

    @Test
    @Transactional
    void putNonExistingPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();
        points.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, points.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(points))
            )
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    void putWithIdMismatchPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(points))
            )
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    void partialUpdatePointsWithPatch() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Update the points using partial update
        Points partialUpdatedPoints = new Points();
        partialUpdatedPoints.setId(points.getId());

        partialUpdatedPoints.date(UPDATED_DATE).meals(UPDATED_MEALS).notes(UPDATED_NOTES);

        restPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoints.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoints))
            )
            .andExpect(status().isOk());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(DEFAULT_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(UPDATED_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(DEFAULT_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    @Transactional
    void fullUpdatePointsWithPatch() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();

        // Update the points using partial update
        Points partialUpdatedPoints = new Points();
        partialUpdatedPoints.setId(points.getId());

        partialUpdatedPoints
            .date(UPDATED_DATE)
            .exercise(UPDATED_EXERCISE)
            .meals(UPDATED_MEALS)
            .alcohol(UPDATED_ALCOHOL)
            .notes(UPDATED_NOTES);

        restPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoints.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoints))
            )
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
    }

    @Test
    @Transactional
    void patchNonExistingPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();
        points.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, points.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(points))
            )
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(points))
            )
            .andExpect(status().isBadRequest());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(points)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(0)).save(points);
    }

    @Test
    @Transactional
    void deletePoints() throws Exception {
        // Initialize the database
        pointsRepository.saveAndFlush(points);

        int databaseSizeBeforeDelete = pointsRepository.findAll().size();

        // Delete the points
        restPointsMockMvc
            .perform(delete(ENTITY_API_URL_ID, points.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Points> pointsList = pointsRepository.findAll();
        assertThat(pointsList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Points in Elasticsearch
        verify(mockPointsSearchRepository, times(1)).deleteById(points.getId());
    }

    @Test
    @Transactional
    void searchPoints() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        pointsRepository.saveAndFlush(points);
        when(mockPointsSearchRepository.search("id:" + points.getId(), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(points), PageRequest.of(0, 1), 1));

        // Search the points
        restPointsMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + points.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(points.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].exercise").value(hasItem(DEFAULT_EXERCISE)))
            .andExpect(jsonPath("$.[*].meals").value(hasItem(DEFAULT_MEALS)))
            .andExpect(jsonPath("$.[*].alcohol").value(hasItem(DEFAULT_ALCOHOL)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)));
    }
}

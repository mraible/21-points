package org.jhipster.health.web.rest;

import org.jhipster.health.Application;
import org.jhipster.health.domain.Goal;
import org.jhipster.health.repository.GoalRepository;
import org.jhipster.health.repository.search.GoalSearchRepository;

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


/**
 * Test class for the GoalResource REST controller.
 *
 * @see GoalResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class GoalResourceTest {

    private static final String DEFAULT_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_NAME = "UPDATED_TEXT";
    private static final String DEFAULT_DESCRIPTION = "SAMPLE_TEXT";
    private static final String UPDATED_DESCRIPTION = "UPDATED_TEXT";

    @Inject
    private GoalRepository goalRepository;

    @Inject
    private GoalSearchRepository goalSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restGoalMockMvc;

    private Goal goal;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        GoalResource goalResource = new GoalResource();
        ReflectionTestUtils.setField(goalResource, "goalRepository", goalRepository);
        ReflectionTestUtils.setField(goalResource, "goalSearchRepository", goalSearchRepository);
        this.restGoalMockMvc = MockMvcBuilders.standaloneSetup(goalResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        goal = new Goal();
        goal.setName(DEFAULT_NAME);
        goal.setDescription(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createGoal() throws Exception {
        int databaseSizeBeforeCreate = goalRepository.findAll().size();

        // Create the Goal

        restGoalMockMvc.perform(post("/api/goals")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(goal)))
                .andExpect(status().isCreated());

        // Validate the Goal in the database
        List<Goal> goals = goalRepository.findAll();
        assertThat(goals).hasSize(databaseSizeBeforeCreate + 1);
        Goal testGoal = goals.get(goals.size() - 1);
        assertThat(testGoal.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGoal.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = goalRepository.findAll().size();
        // set the field null
        goal.setName(null);

        // Create the Goal, which fails.

        restGoalMockMvc.perform(post("/api/goals")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(goal)))
                .andExpect(status().isBadRequest());

        List<Goal> goals = goalRepository.findAll();
        assertThat(goals).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllGoals() throws Exception {
        // Initialize the database
        goalRepository.saveAndFlush(goal);

        // Get all the goals
        restGoalMockMvc.perform(get("/api/goals"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(goal.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getGoal() throws Exception {
        // Initialize the database
        goalRepository.saveAndFlush(goal);

        // Get the goal
        restGoalMockMvc.perform(get("/api/goals/{id}", goal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(goal.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGoal() throws Exception {
        // Get the goal
        restGoalMockMvc.perform(get("/api/goals/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGoal() throws Exception {
        // Initialize the database
        goalRepository.saveAndFlush(goal);

		int databaseSizeBeforeUpdate = goalRepository.findAll().size();

        // Update the goal
        goal.setName(UPDATED_NAME);
        goal.setDescription(UPDATED_DESCRIPTION);
        

        restGoalMockMvc.perform(put("/api/goals")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(goal)))
                .andExpect(status().isOk());

        // Validate the Goal in the database
        List<Goal> goals = goalRepository.findAll();
        assertThat(goals).hasSize(databaseSizeBeforeUpdate);
        Goal testGoal = goals.get(goals.size() - 1);
        assertThat(testGoal.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGoal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void deleteGoal() throws Exception {
        // Initialize the database
        goalRepository.saveAndFlush(goal);

		int databaseSizeBeforeDelete = goalRepository.findAll().size();

        // Get the goal
        restGoalMockMvc.perform(delete("/api/goals/{id}", goal.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Goal> goals = goalRepository.findAll();
        assertThat(goals).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package org.jhipster.health.web.rest;

import org.jhipster.health.Application;
import org.jhipster.health.domain.Entry;
import org.jhipster.health.repository.EntryRepository;
import org.jhipster.health.repository.search.EntrySearchRepository;

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
import org.joda.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EntryResource REST controller.
 *
 * @see EntryResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class EntryResourceTest {


    private static final LocalDate DEFAULT_DATE = new LocalDate(0L);
    private static final LocalDate UPDATED_DATE = new LocalDate();

    private static final Integer DEFAULT_EXERCISE = 0;
    private static final Integer UPDATED_EXERCISE = 1;

    private static final Integer DEFAULT_MEALS = 0;
    private static final Integer UPDATED_MEALS = 1;

    private static final Integer DEFAULT_ALCOHOL = 0;
    private static final Integer UPDATED_ALCOHOL = 1;
    private static final String DEFAULT_NOTES = "SAMPLE_TEXT";
    private static final String UPDATED_NOTES = "UPDATED_TEXT";

    @Inject
    private EntryRepository entryRepository;

    @Inject
    private EntrySearchRepository entrySearchRepository;

    private MockMvc restEntryMockMvc;

    private Entry entry;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        EntryResource entryResource = new EntryResource();
        ReflectionTestUtils.setField(entryResource, "entryRepository", entryRepository);
        ReflectionTestUtils.setField(entryResource, "entrySearchRepository", entrySearchRepository);
        this.restEntryMockMvc = MockMvcBuilders.standaloneSetup(entryResource).build();
    }

    @Before
    public void initTest() {
        entry = new Entry();
        entry.setDate(DEFAULT_DATE);
        entry.setExercise(DEFAULT_EXERCISE);
        entry.setMeals(DEFAULT_MEALS);
        entry.setAlcohol(DEFAULT_ALCOHOL);
        entry.setNotes(DEFAULT_NOTES);
    }

    @Test
    @Transactional
    public void createEntry() throws Exception {
        int databaseSizeBeforeCreate = entryRepository.findAll().size();

        // Create the Entry
        restEntryMockMvc.perform(post("/api/entrys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(entry)))
                .andExpect(status().isCreated());

        // Validate the Entry in the database
        List<Entry> entrys = entryRepository.findAll();
        assertThat(entrys).hasSize(databaseSizeBeforeCreate + 1);
        Entry testEntry = entrys.get(entrys.size() - 1);
        assertThat(testEntry.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEntry.getExercise()).isEqualTo(DEFAULT_EXERCISE);
        assertThat(testEntry.getMeals()).isEqualTo(DEFAULT_MEALS);
        assertThat(testEntry.getAlcohol()).isEqualTo(DEFAULT_ALCOHOL);
        assertThat(testEntry.getNotes()).isEqualTo(DEFAULT_NOTES);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        // Validate the database is empty
        assertThat(entryRepository.findAll()).hasSize(0);
        // set the field null
        entry.setDate(null);

        // Create the Entry, which fails.
        restEntryMockMvc.perform(post("/api/entrys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(entry)))
                .andExpect(status().isBadRequest());

        // Validate the database is still empty
        List<Entry> entrys = entryRepository.findAll();
        assertThat(entrys).hasSize(0);
    }

    @Test
    @Transactional
    public void getAllEntrys() throws Exception {
        // Initialize the database
        entryRepository.saveAndFlush(entry);

        // Get all the entrys
        restEntryMockMvc.perform(get("/api/entrys"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(entry.getId().intValue())))
                .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
                .andExpect(jsonPath("$.[*].exercise").value(hasItem(DEFAULT_EXERCISE)))
                .andExpect(jsonPath("$.[*].meals").value(hasItem(DEFAULT_MEALS)))
                .andExpect(jsonPath("$.[*].alcohol").value(hasItem(DEFAULT_ALCOHOL)))
                .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES.toString())));
    }

    @Test
    @Transactional
    public void getEntry() throws Exception {
        // Initialize the database
        entryRepository.saveAndFlush(entry);

        // Get the entry
        restEntryMockMvc.perform(get("/api/entrys/{id}", entry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(entry.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.exercise").value(DEFAULT_EXERCISE))
            .andExpect(jsonPath("$.meals").value(DEFAULT_MEALS))
            .andExpect(jsonPath("$.alcohol").value(DEFAULT_ALCOHOL))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEntry() throws Exception {
        // Get the entry
        restEntryMockMvc.perform(get("/api/entrys/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEntry() throws Exception {
        // Initialize the database
        entryRepository.saveAndFlush(entry);

		int databaseSizeBeforeUpdate = entryRepository.findAll().size();

        // Update the entry
        entry.setDate(UPDATED_DATE);
        entry.setExercise(UPDATED_EXERCISE);
        entry.setMeals(UPDATED_MEALS);
        entry.setAlcohol(UPDATED_ALCOHOL);
        entry.setNotes(UPDATED_NOTES);
        restEntryMockMvc.perform(put("/api/entrys")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(entry)))
                .andExpect(status().isOk());

        // Validate the Entry in the database
        List<Entry> entrys = entryRepository.findAll();
        assertThat(entrys).hasSize(databaseSizeBeforeUpdate);
        Entry testEntry = entrys.get(entrys.size() - 1);
        assertThat(testEntry.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEntry.getExercise()).isEqualTo(UPDATED_EXERCISE);
        assertThat(testEntry.getMeals()).isEqualTo(UPDATED_MEALS);
        assertThat(testEntry.getAlcohol()).isEqualTo(UPDATED_ALCOHOL);
        assertThat(testEntry.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    @Transactional
    public void deleteEntry() throws Exception {
        // Initialize the database
        entryRepository.saveAndFlush(entry);

		int databaseSizeBeforeDelete = entryRepository.findAll().size();

        // Get the entry
        restEntryMockMvc.perform(delete("/api/entrys/{id}", entry.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Entry> entrys = entryRepository.findAll();
        assertThat(entrys).hasSize(databaseSizeBeforeDelete - 1);
    }
}

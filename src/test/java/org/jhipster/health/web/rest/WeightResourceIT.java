package org.jhipster.health.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.jhipster.health.domain.WeightAsserts.*;
import static org.jhipster.health.web.rest.TestUtil.createUpdateProxyForBean;
import static org.jhipster.health.web.rest.TestUtil.sameInstant;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.apache.commons.collections4.IterableUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.assertj.core.util.IterableUtil;
import org.jhipster.health.IntegrationTest;
import org.jhipster.health.domain.User;
import org.jhipster.health.domain.Weight;
import org.jhipster.health.repository.UserRepository;
import org.jhipster.health.repository.WeightRepository;
import org.jhipster.health.repository.search.WeightSearchRepository;
import org.jhipster.health.security.AuthoritiesConstants;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link WeightResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class WeightResourceIT {

    private final Logger log = LoggerFactory.getLogger(WeightResourceIT.class);

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_WEIGHT = 1D;
    private static final Double UPDATED_WEIGHT = 2D;

    private static final String ENTITY_API_URL = "/api/weights";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/weights/_search";

    private static final String TEST_USERNAME = "user";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private WeightRepository weightRepository;

    @Mock
    private WeightRepository weightRepositoryMock;

    @Autowired
    private WeightSearchRepository weightSearchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWeightMockMvc;

    private Weight weight;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Weight createEntity(EntityManager em) {
        Weight weight = new Weight().timestamp(DEFAULT_TIMESTAMP).weight(DEFAULT_WEIGHT);
        return weight;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Weight createUpdatedEntity(EntityManager em) {
        Weight weight = new Weight().timestamp(UPDATED_TIMESTAMP).weight(UPDATED_WEIGHT);
        return weight;
    }

    @AfterEach
    public void cleanupElasticSearchRepository() {
        weightSearchRepository.deleteAll();
        assertThat(weightSearchRepository.count()).isEqualTo(0);
    }

    @BeforeEach
    public void initTest() {
        weight = createEntity(em);
        // re-create the default user if necessary since UserResourceIT deletes all users
        Optional<User> user = userRepository.findOneByLogin(TEST_USERNAME);
        if (user.isEmpty()) {
            User testUser = new User();
            testUser.setLogin(TEST_USERNAME);
            testUser.setPassword(RandomStringUtils.randomAlphanumeric(60));
            testUser.setEmail(TEST_USERNAME + "@example.com");
            testUser.setActivated(true);
            userRepository.saveAndFlush(testUser);
        }
    }

    @Test
    @Transactional
    void createWeight() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        // Create the Weight
        var returnedWeight = om.readValue(
            restWeightMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(weight)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Weight.class
        );

        // Validate the Weight in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertWeightUpdatableFieldsEquals(returnedWeight, getPersistedWeight(returnedWeight));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore + 1);
            });
    }

    @Test
    @Transactional
    void createWeightWithExistingId() throws Exception {
        // Create the Weight with an existing ID
        weight.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(weight)))
            .andExpect(status().isBadRequest());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkTimestampIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        // set the field null
        weight.setTimestamp(null);

        // Create the Weight, which fails.

        restWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(weight)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkWeightIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        // set the field null
        weight.setWeight(null);

        // Create the Weight, which fails.
        restWeightMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(weight)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    void getAllWeights() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        // Get all the weightList
        restWeightMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weight.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWeightsWithEagerRelationshipsIsEnabled() throws Exception {
        when(weightRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restWeightMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(weightRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWeightsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(weightRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restWeightMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(weightRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getWeight() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        // Get the weight
        restWeightMockMvc
            .perform(get(ENTITY_API_URL_ID, weight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(weight.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(sameInstant(DEFAULT_TIMESTAMP)))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingWeight() throws Exception {
        // Get the weight
        restWeightMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWeight() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        long databaseSizeBeforeUpdate = getRepositoryCount();
        weightSearchRepository.save(weight);
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());

        // Update the weight
        Weight updatedWeight = weightRepository.findById(weight.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedWeight are not directly saved in db
        em.detach(updatedWeight);
        updatedWeight.timestamp(UPDATED_TIMESTAMP).weight(UPDATED_WEIGHT);

        restWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWeight.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedWeight))
            )
            .andExpect(status().isOk());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedWeightToMatchAllProperties(updatedWeight);

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
                List<Weight> weightSearchList = IterableUtils.toList(weightSearchRepository.findAll());
                Weight testWeightSearch = weightSearchList.get(searchDatabaseSizeAfter - 1);

                assertWeightAllPropertiesEquals(testWeightSearch, updatedWeight);
            });
    }

    @Test
    @Transactional
    void putNonExistingWeight() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        weight.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeightMockMvc
            .perform(put(ENTITY_API_URL_ID, weight.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(weight)))
            .andExpect(status().isBadRequest());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithIdMismatchWeight() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        weight.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeightMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(weight))
            )
            .andExpect(status().isBadRequest());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWeight() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        weight.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeightMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(weight)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void partialUpdateWeightWithPatch() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the weight using partial update
        Weight partialUpdatedWeight = new Weight();
        partialUpdatedWeight.setId(weight.getId());

        restWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedWeight))
            )
            .andExpect(status().isOk());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertWeightUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedWeight, weight), getPersistedWeight(weight));
    }

    @Test
    @Transactional
    void fullUpdateWeightWithPatch() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the weight using partial update
        Weight partialUpdatedWeight = new Weight();
        partialUpdatedWeight.setId(weight.getId());

        partialUpdatedWeight.timestamp(UPDATED_TIMESTAMP).weight(UPDATED_WEIGHT);

        restWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeight.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedWeight))
            )
            .andExpect(status().isOk());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertWeightUpdatableFieldsEquals(partialUpdatedWeight, getPersistedWeight(partialUpdatedWeight));
    }

    @Test
    @Transactional
    void patchNonExistingWeight() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        weight.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, weight.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(weight))
            )
            .andExpect(status().isBadRequest());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWeight() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        weight.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeightMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(weight))
            )
            .andExpect(status().isBadRequest());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWeight() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        weight.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeightMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(weight)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Weight in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void deleteWeight() throws Exception {
        // Initialize the database
        weightRepository.saveAndFlush(weight);
        weightRepository.save(weight);
        weightSearchRepository.save(weight);

        long databaseSizeBeforeDelete = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeBefore).isEqualTo(databaseSizeBeforeDelete);

        // Delete the weight
        restWeightMockMvc
            .perform(delete(ENTITY_API_URL_ID, weight.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(weightSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore - 1);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    void searchWeight() throws Exception {
        // Initialize the database
        weight = weightRepository.saveAndFlush(weight);
        weightSearchRepository.save(weight);

        // Search the weight
        restWeightMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + weight.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(weight.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())));
    }

    private void createByMonth(ZonedDateTime firstDate, ZonedDateTime firstDayOfLastMonth) {
        log.debug("firstDate: {}, firstOfLastMonth: {}", firstDate.toString(), firstDayOfLastMonth.toString());
        User user = userRepository.findOneByLogin(TEST_USERNAME).get();

        weightRepository.saveAndFlush(new Weight(firstDate, 205D, user));
        weightRepository.saveAndFlush(new Weight(firstDate.plusDays(10), 200D, user));
        weightRepository.saveAndFlush(new Weight(firstDate.plusDays(20), 195D, user));

        // last month
        weightRepository.saveAndFlush(new Weight(firstDayOfLastMonth, 208D, user));
        weightRepository.saveAndFlush(new Weight(firstDayOfLastMonth.plusDays(11), 206D, user));
        weightRepository.saveAndFlush(new Weight(firstDayOfLastMonth.plusDays(23), 204D, user));
    }

    @Test
    @Transactional
    public void getForLast30Days() throws Exception {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime thirtyDaysAgo = now.minusDays(30);
        ZonedDateTime firstDayOfLastMonth = now.withDayOfMonth(1).minusMonths(1);
        createByMonth(thirtyDaysAgo, firstDayOfLastMonth);

        // Get all the weighIns
        restWeightMockMvc
            .perform(get("/api/weights"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$", hasSize(6)));

        // Get the weighIns for the last 30 days
        restWeightMockMvc
            .perform(get("/api/weight-by-days/{days}", 30))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.period").value("Last 30 Days"))
            .andExpect(jsonPath("$.weighIns.[*].weight").value(hasItem(200D)));
    }

    @Test
    @Transactional
    public void getByLastMonth() throws Exception {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime firstOfMonth = now.withDayOfMonth(1);
        ZonedDateTime firstDayOfLastMonth = firstOfMonth.minusMonths(1);
        createByMonth(firstOfMonth, firstDayOfLastMonth);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");

        // Get the points for last week
        restWeightMockMvc
            .perform(get("/api/weight-by-month/{yearAndMonth}", fmt.format(firstDayOfLastMonth)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.period").value(fmt.format(firstDayOfLastMonth)))
            .andExpect(jsonPath("$.weighIns.[*].weight").value(hasItem(206D)));
    }

    protected long getRepositoryCount() {
        return weightRepository.count();
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

    protected Weight getPersistedWeight(Weight weight) {
        return weightRepository.findById(weight.getId()).orElseThrow();
    }

    protected void assertPersistedWeightToMatchAllProperties(Weight expectedWeight) {
        assertWeightAllPropertiesEquals(expectedWeight, getPersistedWeight(expectedWeight));
    }

    protected void assertPersistedWeightToMatchUpdatableProperties(Weight expectedWeight) {
        assertWeightAllUpdatablePropertiesEquals(expectedWeight, getPersistedWeight(expectedWeight));
    }
}

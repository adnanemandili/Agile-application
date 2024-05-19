package com.mycompany.agile.web.rest;

import static com.mycompany.agile.domain.MatiereAsserts.*;
import static com.mycompany.agile.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.agile.IntegrationTest;
import com.mycompany.agile.domain.Matiere;
import com.mycompany.agile.repository.MatiereRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MatiereResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MatiereResourceIT {

    private static final String DEFAULT_SUBJECT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/matieres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MatiereRepository matiereRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMatiereMockMvc;

    private Matiere matiere;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matiere createEntity(EntityManager em) {
        Matiere matiere = new Matiere().subjectName(DEFAULT_SUBJECT_NAME).description(DEFAULT_DESCRIPTION);
        return matiere;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matiere createUpdatedEntity(EntityManager em) {
        Matiere matiere = new Matiere().subjectName(UPDATED_SUBJECT_NAME).description(UPDATED_DESCRIPTION);
        return matiere;
    }

    @BeforeEach
    public void initTest() {
        matiere = createEntity(em);
    }

    @Test
    @Transactional
    void createMatiere() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Matiere
        var returnedMatiere = om.readValue(
            restMatiereMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(matiere)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Matiere.class
        );

        // Validate the Matiere in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMatiereUpdatableFieldsEquals(returnedMatiere, getPersistedMatiere(returnedMatiere));
    }

    @Test
    @Transactional
    void createMatiereWithExistingId() throws Exception {
        // Create the Matiere with an existing ID
        matiere.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMatiereMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(matiere)))
            .andExpect(status().isBadRequest());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSubjectNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        matiere.setSubjectName(null);

        // Create the Matiere, which fails.

        restMatiereMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(matiere)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMatieres() throws Exception {
        // Initialize the database
        matiereRepository.saveAndFlush(matiere);

        // Get all the matiereList
        restMatiereMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(matiere.getId().intValue())))
            .andExpect(jsonPath("$.[*].subjectName").value(hasItem(DEFAULT_SUBJECT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getMatiere() throws Exception {
        // Initialize the database
        matiereRepository.saveAndFlush(matiere);

        // Get the matiere
        restMatiereMockMvc
            .perform(get(ENTITY_API_URL_ID, matiere.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(matiere.getId().intValue()))
            .andExpect(jsonPath("$.subjectName").value(DEFAULT_SUBJECT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingMatiere() throws Exception {
        // Get the matiere
        restMatiereMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMatiere() throws Exception {
        // Initialize the database
        matiereRepository.saveAndFlush(matiere);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the matiere
        Matiere updatedMatiere = matiereRepository.findById(matiere.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMatiere are not directly saved in db
        em.detach(updatedMatiere);
        updatedMatiere.subjectName(UPDATED_SUBJECT_NAME).description(UPDATED_DESCRIPTION);

        restMatiereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMatiere.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedMatiere))
            )
            .andExpect(status().isOk());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMatiereToMatchAllProperties(updatedMatiere);
    }

    @Test
    @Transactional
    void putNonExistingMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatiereMockMvc
            .perform(put(ENTITY_API_URL_ID, matiere.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(matiere)))
            .andExpect(status().isBadRequest());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatiereMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(matiere))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatiereMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(matiere)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMatiereWithPatch() throws Exception {
        // Initialize the database
        matiereRepository.saveAndFlush(matiere);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the matiere using partial update
        Matiere partialUpdatedMatiere = new Matiere();
        partialUpdatedMatiere.setId(matiere.getId());

        partialUpdatedMatiere.description(UPDATED_DESCRIPTION);

        restMatiereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatiere.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMatiere))
            )
            .andExpect(status().isOk());

        // Validate the Matiere in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMatiereUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMatiere, matiere), getPersistedMatiere(matiere));
    }

    @Test
    @Transactional
    void fullUpdateMatiereWithPatch() throws Exception {
        // Initialize the database
        matiereRepository.saveAndFlush(matiere);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the matiere using partial update
        Matiere partialUpdatedMatiere = new Matiere();
        partialUpdatedMatiere.setId(matiere.getId());

        partialUpdatedMatiere.subjectName(UPDATED_SUBJECT_NAME).description(UPDATED_DESCRIPTION);

        restMatiereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMatiere.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMatiere))
            )
            .andExpect(status().isOk());

        // Validate the Matiere in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMatiereUpdatableFieldsEquals(partialUpdatedMatiere, getPersistedMatiere(partialUpdatedMatiere));
    }

    @Test
    @Transactional
    void patchNonExistingMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatiereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, matiere.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(matiere))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatiereMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(matiere))
            )
            .andExpect(status().isBadRequest());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMatiere() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        matiere.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMatiereMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(matiere)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Matiere in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMatiere() throws Exception {
        // Initialize the database
        matiereRepository.saveAndFlush(matiere);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the matiere
        restMatiereMockMvc
            .perform(delete(ENTITY_API_URL_ID, matiere.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return matiereRepository.count();
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

    protected Matiere getPersistedMatiere(Matiere matiere) {
        return matiereRepository.findById(matiere.getId()).orElseThrow();
    }

    protected void assertPersistedMatiereToMatchAllProperties(Matiere expectedMatiere) {
        assertMatiereAllPropertiesEquals(expectedMatiere, getPersistedMatiere(expectedMatiere));
    }

    protected void assertPersistedMatiereToMatchUpdatableProperties(Matiere expectedMatiere) {
        assertMatiereAllUpdatablePropertiesEquals(expectedMatiere, getPersistedMatiere(expectedMatiere));
    }
}

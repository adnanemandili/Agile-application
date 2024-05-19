package com.mycompany.agile.web.rest;

import static com.mycompany.agile.domain.EtudiantAsserts.*;
import static com.mycompany.agile.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.agile.IntegrationTest;
import com.mycompany.agile.domain.Etudiant;
import com.mycompany.agile.domain.enumeration.Filiere;
import com.mycompany.agile.domain.enumeration.Niveau;
import com.mycompany.agile.repository.EtudiantRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link EtudiantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtudiantResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_APOGEE = "AAAAAAAAAA";
    private static final String UPDATED_APOGEE = "BBBBBBBBBB";

    private static final Niveau DEFAULT_NIVEAU = Niveau.PermiereAnnee;
    private static final Niveau UPDATED_NIVEAU = Niveau.DeusiemeAnnee;

    private static final Filiere DEFAULT_FILERE = Filiere.GL;
    private static final Filiere UPDATED_FILERE = Filiere.BI;

    private static final LocalDate DEFAULT_ENROLLMENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ENROLLMENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/etudiants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtudiantMockMvc;

    private Etudiant etudiant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etudiant createEntity(EntityManager em) {
        Etudiant etudiant = new Etudiant()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .apogee(DEFAULT_APOGEE)
            .niveau(DEFAULT_NIVEAU)
            .filere(DEFAULT_FILERE)
            .enrollmentDate(DEFAULT_ENROLLMENT_DATE);
        return etudiant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etudiant createUpdatedEntity(EntityManager em) {
        Etudiant etudiant = new Etudiant()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .apogee(UPDATED_APOGEE)
            .niveau(UPDATED_NIVEAU)
            .filere(UPDATED_FILERE)
            .enrollmentDate(UPDATED_ENROLLMENT_DATE);
        return etudiant;
    }

    @BeforeEach
    public void initTest() {
        etudiant = createEntity(em);
    }

    @Test
    @Transactional
    void createEtudiant() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Etudiant
        var returnedEtudiant = om.readValue(
            restEtudiantMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Etudiant.class
        );

        // Validate the Etudiant in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEtudiantUpdatableFieldsEquals(returnedEtudiant, getPersistedEtudiant(returnedEtudiant));
    }

    @Test
    @Transactional
    void createEtudiantWithExistingId() throws Exception {
        // Create the Etudiant with an existing ID
        etudiant.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtudiantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant)))
            .andExpect(status().isBadRequest());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        etudiant.setFirstName(null);

        // Create the Etudiant, which fails.

        restEtudiantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        etudiant.setLastName(null);

        // Create the Etudiant, which fails.

        restEtudiantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        etudiant.setEmail(null);

        // Create the Etudiant, which fails.

        restEtudiantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkApogeeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        etudiant.setApogee(null);

        // Create the Etudiant, which fails.

        restEtudiantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEtudiants() throws Exception {
        // Initialize the database
        etudiantRepository.saveAndFlush(etudiant);

        // Get all the etudiantList
        restEtudiantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etudiant.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].apogee").value(hasItem(DEFAULT_APOGEE)))
            .andExpect(jsonPath("$.[*].niveau").value(hasItem(DEFAULT_NIVEAU.toString())))
            .andExpect(jsonPath("$.[*].filere").value(hasItem(DEFAULT_FILERE.toString())))
            .andExpect(jsonPath("$.[*].enrollmentDate").value(hasItem(DEFAULT_ENROLLMENT_DATE.toString())));
    }

    @Test
    @Transactional
    void getEtudiant() throws Exception {
        // Initialize the database
        etudiantRepository.saveAndFlush(etudiant);

        // Get the etudiant
        restEtudiantMockMvc
            .perform(get(ENTITY_API_URL_ID, etudiant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etudiant.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.apogee").value(DEFAULT_APOGEE))
            .andExpect(jsonPath("$.niveau").value(DEFAULT_NIVEAU.toString()))
            .andExpect(jsonPath("$.filere").value(DEFAULT_FILERE.toString()))
            .andExpect(jsonPath("$.enrollmentDate").value(DEFAULT_ENROLLMENT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEtudiant() throws Exception {
        // Get the etudiant
        restEtudiantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEtudiant() throws Exception {
        // Initialize the database
        etudiantRepository.saveAndFlush(etudiant);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etudiant
        Etudiant updatedEtudiant = etudiantRepository.findById(etudiant.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEtudiant are not directly saved in db
        em.detach(updatedEtudiant);
        updatedEtudiant
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .apogee(UPDATED_APOGEE)
            .niveau(UPDATED_NIVEAU)
            .filere(UPDATED_FILERE)
            .enrollmentDate(UPDATED_ENROLLMENT_DATE);

        restEtudiantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEtudiant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEtudiant))
            )
            .andExpect(status().isOk());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEtudiantToMatchAllProperties(updatedEtudiant);
    }

    @Test
    @Transactional
    void putNonExistingEtudiant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etudiant.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtudiantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etudiant.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtudiant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etudiant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtudiantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(etudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtudiant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etudiant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtudiantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etudiant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtudiantWithPatch() throws Exception {
        // Initialize the database
        etudiantRepository.saveAndFlush(etudiant);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etudiant using partial update
        Etudiant partialUpdatedEtudiant = new Etudiant();
        partialUpdatedEtudiant.setId(etudiant.getId());

        partialUpdatedEtudiant.niveau(UPDATED_NIVEAU).enrollmentDate(UPDATED_ENROLLMENT_DATE);

        restEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtudiant.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtudiant))
            )
            .andExpect(status().isOk());

        // Validate the Etudiant in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtudiantUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedEtudiant, etudiant), getPersistedEtudiant(etudiant));
    }

    @Test
    @Transactional
    void fullUpdateEtudiantWithPatch() throws Exception {
        // Initialize the database
        etudiantRepository.saveAndFlush(etudiant);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etudiant using partial update
        Etudiant partialUpdatedEtudiant = new Etudiant();
        partialUpdatedEtudiant.setId(etudiant.getId());

        partialUpdatedEtudiant
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .apogee(UPDATED_APOGEE)
            .niveau(UPDATED_NIVEAU)
            .filere(UPDATED_FILERE)
            .enrollmentDate(UPDATED_ENROLLMENT_DATE);

        restEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtudiant.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtudiant))
            )
            .andExpect(status().isOk());

        // Validate the Etudiant in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtudiantUpdatableFieldsEquals(partialUpdatedEtudiant, getPersistedEtudiant(partialUpdatedEtudiant));
    }

    @Test
    @Transactional
    void patchNonExistingEtudiant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etudiant.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etudiant.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtudiant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etudiant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtudiant() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etudiant.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtudiantMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(etudiant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etudiant in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtudiant() throws Exception {
        // Initialize the database
        etudiantRepository.saveAndFlush(etudiant);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the etudiant
        restEtudiantMockMvc
            .perform(delete(ENTITY_API_URL_ID, etudiant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return etudiantRepository.count();
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

    protected Etudiant getPersistedEtudiant(Etudiant etudiant) {
        return etudiantRepository.findById(etudiant.getId()).orElseThrow();
    }

    protected void assertPersistedEtudiantToMatchAllProperties(Etudiant expectedEtudiant) {
        assertEtudiantAllPropertiesEquals(expectedEtudiant, getPersistedEtudiant(expectedEtudiant));
    }

    protected void assertPersistedEtudiantToMatchUpdatableProperties(Etudiant expectedEtudiant) {
        assertEtudiantAllUpdatablePropertiesEquals(expectedEtudiant, getPersistedEtudiant(expectedEtudiant));
    }
}

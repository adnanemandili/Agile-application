package com.mycompany.agile.web.rest;

import static com.mycompany.agile.domain.ProfesseurAsserts.*;
import static com.mycompany.agile.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.agile.IntegrationTest;
import com.mycompany.agile.domain.Professeur;
import com.mycompany.agile.repository.ProfesseurRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProfesseurResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProfesseurResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_HIRE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_HIRE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/professeurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProfesseurRepository professeurRepository;

    @Mock
    private ProfesseurRepository professeurRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProfesseurMockMvc;

    private Professeur professeur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Professeur createEntity(EntityManager em) {
        Professeur professeur = new Professeur()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .hireDate(DEFAULT_HIRE_DATE);
        return professeur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Professeur createUpdatedEntity(EntityManager em) {
        Professeur professeur = new Professeur()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE);
        return professeur;
    }

    @BeforeEach
    public void initTest() {
        professeur = createEntity(em);
    }

    @Test
    @Transactional
    void createProfesseur() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Professeur
        var returnedProfesseur = om.readValue(
            restProfesseurMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(professeur)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Professeur.class
        );

        // Validate the Professeur in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertProfesseurUpdatableFieldsEquals(returnedProfesseur, getPersistedProfesseur(returnedProfesseur));
    }

    @Test
    @Transactional
    void createProfesseurWithExistingId() throws Exception {
        // Create the Professeur with an existing ID
        professeur.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProfesseurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(professeur)))
            .andExpect(status().isBadRequest());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        professeur.setFirstName(null);

        // Create the Professeur, which fails.

        restProfesseurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(professeur)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        professeur.setLastName(null);

        // Create the Professeur, which fails.

        restProfesseurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(professeur)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        professeur.setEmail(null);

        // Create the Professeur, which fails.

        restProfesseurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(professeur)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProfesseurs() throws Exception {
        // Initialize the database
        professeurRepository.saveAndFlush(professeur);

        // Get all the professeurList
        restProfesseurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(professeur.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].hireDate").value(hasItem(DEFAULT_HIRE_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProfesseursWithEagerRelationshipsIsEnabled() throws Exception {
        when(professeurRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProfesseurMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(professeurRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProfesseursWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(professeurRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProfesseurMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(professeurRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProfesseur() throws Exception {
        // Initialize the database
        professeurRepository.saveAndFlush(professeur);

        // Get the professeur
        restProfesseurMockMvc
            .perform(get(ENTITY_API_URL_ID, professeur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(professeur.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.hireDate").value(DEFAULT_HIRE_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProfesseur() throws Exception {
        // Get the professeur
        restProfesseurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProfesseur() throws Exception {
        // Initialize the database
        professeurRepository.saveAndFlush(professeur);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the professeur
        Professeur updatedProfesseur = professeurRepository.findById(professeur.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProfesseur are not directly saved in db
        em.detach(updatedProfesseur);
        updatedProfesseur
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE);

        restProfesseurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProfesseur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedProfesseur))
            )
            .andExpect(status().isOk());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProfesseurToMatchAllProperties(updatedProfesseur);
    }

    @Test
    @Transactional
    void putNonExistingProfesseur() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        professeur.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfesseurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, professeur.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(professeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProfesseur() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        professeur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfesseurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(professeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProfesseur() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        professeur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfesseurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(professeur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProfesseurWithPatch() throws Exception {
        // Initialize the database
        professeurRepository.saveAndFlush(professeur);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the professeur using partial update
        Professeur partialUpdatedProfesseur = new Professeur();
        partialUpdatedProfesseur.setId(professeur.getId());

        partialUpdatedProfesseur.firstName(UPDATED_FIRST_NAME).phoneNumber(UPDATED_PHONE_NUMBER);

        restProfesseurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfesseur.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProfesseur))
            )
            .andExpect(status().isOk());

        // Validate the Professeur in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProfesseurUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProfesseur, professeur),
            getPersistedProfesseur(professeur)
        );
    }

    @Test
    @Transactional
    void fullUpdateProfesseurWithPatch() throws Exception {
        // Initialize the database
        professeurRepository.saveAndFlush(professeur);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the professeur using partial update
        Professeur partialUpdatedProfesseur = new Professeur();
        partialUpdatedProfesseur.setId(professeur.getId());

        partialUpdatedProfesseur
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE);

        restProfesseurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfesseur.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProfesseur))
            )
            .andExpect(status().isOk());

        // Validate the Professeur in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProfesseurUpdatableFieldsEquals(partialUpdatedProfesseur, getPersistedProfesseur(partialUpdatedProfesseur));
    }

    @Test
    @Transactional
    void patchNonExistingProfesseur() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        professeur.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfesseurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, professeur.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(professeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProfesseur() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        professeur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfesseurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(professeur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProfesseur() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        professeur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfesseurMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(professeur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Professeur in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProfesseur() throws Exception {
        // Initialize the database
        professeurRepository.saveAndFlush(professeur);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the professeur
        restProfesseurMockMvc
            .perform(delete(ENTITY_API_URL_ID, professeur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return professeurRepository.count();
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

    protected Professeur getPersistedProfesseur(Professeur professeur) {
        return professeurRepository.findById(professeur.getId()).orElseThrow();
    }

    protected void assertPersistedProfesseurToMatchAllProperties(Professeur expectedProfesseur) {
        assertProfesseurAllPropertiesEquals(expectedProfesseur, getPersistedProfesseur(expectedProfesseur));
    }

    protected void assertPersistedProfesseurToMatchUpdatableProperties(Professeur expectedProfesseur) {
        assertProfesseurAllUpdatablePropertiesEquals(expectedProfesseur, getPersistedProfesseur(expectedProfesseur));
    }
}

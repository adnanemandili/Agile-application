import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Etudiant e2e test', () => {
  const etudiantPageUrl = '/etudiant';
  const etudiantPageUrlPattern = new RegExp('/etudiant(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const etudiantSample = { firstName: 'Derrick', lastName: 'Robel', email: 'Corene_Stoltenberg@yahoo.com', apogee: 'back boil' };

  let etudiant;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/etudiants+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/etudiants').as('postEntityRequest');
    cy.intercept('DELETE', '/api/etudiants/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (etudiant) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/etudiants/${etudiant.id}`,
      }).then(() => {
        etudiant = undefined;
      });
    }
  });

  it('Etudiants menu should load Etudiants page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('etudiant');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Etudiant').should('exist');
    cy.url().should('match', etudiantPageUrlPattern);
  });

  describe('Etudiant page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(etudiantPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Etudiant page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/etudiant/new$'));
        cy.getEntityCreateUpdateHeading('Etudiant');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', etudiantPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/etudiants',
          body: etudiantSample,
        }).then(({ body }) => {
          etudiant = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/etudiants+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [etudiant],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(etudiantPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Etudiant page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('etudiant');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', etudiantPageUrlPattern);
      });

      it('edit button click should load edit Etudiant page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Etudiant');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', etudiantPageUrlPattern);
      });

      it('edit button click should load edit Etudiant page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Etudiant');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', etudiantPageUrlPattern);
      });

      it('last delete button click should delete instance of Etudiant', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('etudiant').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', etudiantPageUrlPattern);

        etudiant = undefined;
      });
    });
  });

  describe('new Etudiant page', () => {
    beforeEach(() => {
      cy.visit(`${etudiantPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Etudiant');
    });

    it('should create an instance of Etudiant', () => {
      cy.get(`[data-cy="firstName"]`).type('Herbert');
      cy.get(`[data-cy="firstName"]`).should('have.value', 'Herbert');

      cy.get(`[data-cy="lastName"]`).type('Moore');
      cy.get(`[data-cy="lastName"]`).should('have.value', 'Moore');

      cy.get(`[data-cy="email"]`).type('Pearlie.Streich-Jacobs11@yahoo.com');
      cy.get(`[data-cy="email"]`).should('have.value', 'Pearlie.Streich-Jacobs11@yahoo.com');

      cy.get(`[data-cy="apogee"]`).type('endorse towards');
      cy.get(`[data-cy="apogee"]`).should('have.value', 'endorse towards');

      cy.get(`[data-cy="niveau"]`).select('TroisiemeAnnee');

      cy.get(`[data-cy="filere"]`).select('GL');

      cy.get(`[data-cy="enrollmentDate"]`).type('2024-05-19');
      cy.get(`[data-cy="enrollmentDate"]`).blur();
      cy.get(`[data-cy="enrollmentDate"]`).should('have.value', '2024-05-19');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        etudiant = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', etudiantPageUrlPattern);
    });
  });
});

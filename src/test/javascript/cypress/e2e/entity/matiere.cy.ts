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

describe('Matiere e2e test', () => {
  const matierePageUrl = '/matiere';
  const matierePageUrlPattern = new RegExp('/matiere(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const matiereSample = { subjectName: 'cloudy warmly between' };

  let matiere;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/matieres+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/matieres').as('postEntityRequest');
    cy.intercept('DELETE', '/api/matieres/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (matiere) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/matieres/${matiere.id}`,
      }).then(() => {
        matiere = undefined;
      });
    }
  });

  it('Matieres menu should load Matieres page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('matiere');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Matiere').should('exist');
    cy.url().should('match', matierePageUrlPattern);
  });

  describe('Matiere page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(matierePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Matiere page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/matiere/new$'));
        cy.getEntityCreateUpdateHeading('Matiere');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', matierePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/matieres',
          body: matiereSample,
        }).then(({ body }) => {
          matiere = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/matieres+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [matiere],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(matierePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Matiere page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('matiere');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', matierePageUrlPattern);
      });

      it('edit button click should load edit Matiere page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Matiere');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', matierePageUrlPattern);
      });

      it('edit button click should load edit Matiere page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Matiere');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', matierePageUrlPattern);
      });

      it('last delete button click should delete instance of Matiere', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('matiere').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', matierePageUrlPattern);

        matiere = undefined;
      });
    });
  });

  describe('new Matiere page', () => {
    beforeEach(() => {
      cy.visit(`${matierePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Matiere');
    });

    it('should create an instance of Matiere', () => {
      cy.get(`[data-cy="subjectName"]`).type('vastly');
      cy.get(`[data-cy="subjectName"]`).should('have.value', 'vastly');

      cy.get(`[data-cy="description"]`).type('merrily');
      cy.get(`[data-cy="description"]`).should('have.value', 'merrily');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        matiere = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', matierePageUrlPattern);
    });
  });
});

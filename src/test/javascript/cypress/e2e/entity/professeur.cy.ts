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

describe('Professeur e2e test', () => {
  const professeurPageUrl = '/professeur';
  const professeurPageUrlPattern = new RegExp('/professeur(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const professeurSample = { firstName: 'Fiona', lastName: 'Boyer', email: 'Berenice_Kassulke@hotmail.com' };

  let professeur;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/professeurs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/professeurs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/professeurs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (professeur) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/professeurs/${professeur.id}`,
      }).then(() => {
        professeur = undefined;
      });
    }
  });

  it('Professeurs menu should load Professeurs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('professeur');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Professeur').should('exist');
    cy.url().should('match', professeurPageUrlPattern);
  });

  describe('Professeur page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(professeurPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Professeur page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/professeur/new$'));
        cy.getEntityCreateUpdateHeading('Professeur');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', professeurPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/professeurs',
          body: professeurSample,
        }).then(({ body }) => {
          professeur = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/professeurs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [professeur],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(professeurPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Professeur page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('professeur');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', professeurPageUrlPattern);
      });

      it('edit button click should load edit Professeur page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Professeur');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', professeurPageUrlPattern);
      });

      it('edit button click should load edit Professeur page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Professeur');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', professeurPageUrlPattern);
      });

      it('last delete button click should delete instance of Professeur', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('professeur').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', professeurPageUrlPattern);

        professeur = undefined;
      });
    });
  });

  describe('new Professeur page', () => {
    beforeEach(() => {
      cy.visit(`${professeurPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Professeur');
    });

    it('should create an instance of Professeur', () => {
      cy.get(`[data-cy="firstName"]`).type('Daphnee');
      cy.get(`[data-cy="firstName"]`).should('have.value', 'Daphnee');

      cy.get(`[data-cy="lastName"]`).type('Stokes');
      cy.get(`[data-cy="lastName"]`).should('have.value', 'Stokes');

      cy.get(`[data-cy="email"]`).type('Heber_Kuphal96@yahoo.com');
      cy.get(`[data-cy="email"]`).should('have.value', 'Heber_Kuphal96@yahoo.com');

      cy.get(`[data-cy="phoneNumber"]`).type('nor shakily');
      cy.get(`[data-cy="phoneNumber"]`).should('have.value', 'nor shakily');

      cy.get(`[data-cy="hireDate"]`).type('2024-05-19');
      cy.get(`[data-cy="hireDate"]`).blur();
      cy.get(`[data-cy="hireDate"]`).should('have.value', '2024-05-19');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        professeur = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', professeurPageUrlPattern);
    });
  });
});

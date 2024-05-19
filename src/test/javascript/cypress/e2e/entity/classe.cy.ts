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

describe('Classe e2e test', () => {
  const classePageUrl = '/classe';
  const classePageUrlPattern = new RegExp('/classe(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const classeSample = { className: 'temp' };

  let classe;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/classes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/classes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/classes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (classe) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/classes/${classe.id}`,
      }).then(() => {
        classe = undefined;
      });
    }
  });

  it('Classes menu should load Classes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('classe');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Classe').should('exist');
    cy.url().should('match', classePageUrlPattern);
  });

  describe('Classe page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(classePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Classe page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/classe/new$'));
        cy.getEntityCreateUpdateHeading('Classe');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', classePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/classes',
          body: classeSample,
        }).then(({ body }) => {
          classe = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/classes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [classe],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(classePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Classe page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('classe');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', classePageUrlPattern);
      });

      it('edit button click should load edit Classe page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Classe');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', classePageUrlPattern);
      });

      it('edit button click should load edit Classe page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Classe');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', classePageUrlPattern);
      });

      it('last delete button click should delete instance of Classe', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('classe').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', classePageUrlPattern);

        classe = undefined;
      });
    });
  });

  describe('new Classe page', () => {
    beforeEach(() => {
      cy.visit(`${classePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Classe');
    });

    it('should create an instance of Classe', () => {
      cy.get(`[data-cy="className"]`).type('circumference');
      cy.get(`[data-cy="className"]`).should('have.value', 'circumference');

      cy.get(`[data-cy="level"]`).type('though softly');
      cy.get(`[data-cy="level"]`).should('have.value', 'though softly');

      cy.get(`[data-cy="group"]`).select('G1');

      cy.get(`[data-cy="niveau"]`).select('DeusiemeAnnee');

      cy.get(`[data-cy="filere"]`).select('BI');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        classe = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', classePageUrlPattern);
    });
  });
});

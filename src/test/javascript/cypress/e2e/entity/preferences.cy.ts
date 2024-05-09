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

describe('Preferences e2e test', () => {
  const preferencesPageUrl = '/preferences';
  const preferencesPageUrlPattern = new RegExp('/preferences(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const preferencesSample = { weeklyGoal: 20, weightUnits: 'LB' };

  let preferences;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/preferences+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/preferences').as('postEntityRequest');
    cy.intercept('DELETE', '/api/preferences/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (preferences) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/preferences/${preferences.id}`,
      }).then(() => {
        preferences = undefined;
      });
    }
  });

  it('Preferences menu should load Preferences page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('preferences');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Preferences').should('exist');
    cy.url().should('match', preferencesPageUrlPattern);
  });

  describe('Preferences page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(preferencesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Preferences page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/preferences/new$'));
        cy.getEntityCreateUpdateHeading('Preferences');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', preferencesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/preferences',
          body: preferencesSample,
        }).then(({ body }) => {
          preferences = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/preferences+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [preferences],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(preferencesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Preferences page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('preferences');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', preferencesPageUrlPattern);
      });

      it('edit button click should load edit Preferences page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Preferences');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', preferencesPageUrlPattern);
      });

      it('edit button click should load edit Preferences page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Preferences');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', preferencesPageUrlPattern);
      });

      it('last delete button click should delete instance of Preferences', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('preferences').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', preferencesPageUrlPattern);

        preferences = undefined;
      });
    });
  });

  describe('new Preferences page', () => {
    beforeEach(() => {
      cy.visit(`${preferencesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Preferences');
    });

    it('should create an instance of Preferences', () => {
      cy.get(`[data-cy="weeklyGoal"]`).type('21');
      cy.get(`[data-cy="weeklyGoal"]`).should('have.value', '21');

      cy.get(`[data-cy="weightUnits"]`).select('KG');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        preferences = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', preferencesPageUrlPattern);
    });
  });
});

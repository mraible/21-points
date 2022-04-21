import { entityItemSelector } from '../../support/commands';
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

describe('Weight e2e test', () => {
  const weightPageUrl = '/weight';
  const weightPageUrlPattern = new RegExp('/weight(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const weightSample = { timestamp: '2016-08-30T10:21:17.947Z', weight: 56955 };

  let weight: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/weights+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/weights').as('postEntityRequest');
    cy.intercept('DELETE', '/api/weights/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (weight) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/weights/${weight.id}`,
      }).then(() => {
        weight = undefined;
      });
    }
  });

  it('Weights menu should load Weights page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('weight');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Weight').should('exist');
    cy.url().should('match', weightPageUrlPattern);
  });

  describe('Weight page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(weightPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Weight page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/weight/new$'));
        cy.getEntityCreateUpdateHeading('Weight');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', weightPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/weights',
          body: weightSample,
        }).then(({ body }) => {
          weight = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/weights+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/weights?page=0&size=20>; rel="last",<http://localhost/api/weights?page=0&size=20>; rel="first"',
              },
              body: [weight],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(weightPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Weight page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('weight');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', weightPageUrlPattern);
      });

      it('edit button click should load edit Weight page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Weight');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', weightPageUrlPattern);
      });

      it('last delete button click should delete instance of Weight', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('weight').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', weightPageUrlPattern);

        weight = undefined;
      });
    });
  });

  describe('new Weight page', () => {
    beforeEach(() => {
      cy.visit(`${weightPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Weight');
    });

    it('should create an instance of Weight', () => {
      cy.get(`[data-cy="timestamp"]`).type('2016-08-30T22:00').should('have.value', '2016-08-30T22:00');

      cy.get(`[data-cy="weight"]`).type('38324').should('have.value', '38324');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        weight = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', weightPageUrlPattern);
    });
  });
});

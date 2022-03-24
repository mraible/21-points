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

describe('Points e2e test', () => {
  const pointsPageUrl = '/points';
  const pointsPageUrlPattern = new RegExp('/points(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const pointsSample = { date: '2017-07-24' };

  let points: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/points+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/points').as('postEntityRequest');
    cy.intercept('DELETE', '/api/points/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (points) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/points/${points.id}`,
      }).then(() => {
        points = undefined;
      });
    }
  });

  it('Points menu should load Points page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('points');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Points').should('exist');
    cy.url().should('match', pointsPageUrlPattern);
  });

  describe('Points page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(pointsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Points page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/points/new$'));
        cy.getEntityCreateUpdateHeading('Points');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', pointsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/points',
          body: pointsSample,
        }).then(({ body }) => {
          points = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/points+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/points?page=0&size=20>; rel="last",<http://localhost/api/points?page=0&size=20>; rel="first"',
              },
              body: [points],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(pointsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Points page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('points');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', pointsPageUrlPattern);
      });

      it('edit button click should load edit Points page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Points');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', pointsPageUrlPattern);
      });

      it('last delete button click should delete instance of Points', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('points').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', pointsPageUrlPattern);

        points = undefined;
      });
    });
  });

  describe('new Points page', () => {
    beforeEach(() => {
      cy.visit(`${pointsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Points');
    });

    it('should create an instance of Points', () => {
      cy.get(`[data-cy="date"]`).type('2017-07-24').should('have.value', '2017-07-24');
      cy.get(`[data-cy="exercise"]`).check();
      cy.get(`[data-cy="meals"]`).check();
      cy.get(`[data-cy="alcohol"]`).check();
      cy.get(`[data-cy="notes"]`).type('Guinea connecting users').should('have.value', 'Guinea connecting users');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        points = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', pointsPageUrlPattern);
    });
  });
});

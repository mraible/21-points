import { browser } from 'protractor';
import { NavBarPage } from './../../page-objects/jhi-page-objects';
import { PointsComponentsPage, PointsUpdatePage } from './points.page-object';

describe('Points e2e test', () => {
    let navBarPage: NavBarPage;
    let pointsUpdatePage: PointsUpdatePage;
    let pointsComponentsPage: PointsComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Points', () => {
        navBarPage.goToEntity('points');
        pointsComponentsPage = new PointsComponentsPage();
        expect(pointsComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.points.home.title/);
    });

    it('should load create Points page', () => {
        pointsComponentsPage.clickOnCreateButton();
        pointsUpdatePage = new PointsUpdatePage();
        expect(pointsUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.points.home.createOrEditLabel/);
        pointsUpdatePage.cancel();
    });

    it('should create and save Points', () => {
        pointsComponentsPage.clickOnCreateButton();
        pointsUpdatePage.setDateInput('2000-12-31');
        expect(pointsUpdatePage.getDateInput()).toMatch('2000-12-31');
        pointsUpdatePage.setExerciseInput('5');
        expect(pointsUpdatePage.getExerciseInput()).toMatch('5');
        pointsUpdatePage.setMealsInput('5');
        expect(pointsUpdatePage.getMealsInput()).toMatch('5');
        pointsUpdatePage.setAlcoholInput('5');
        expect(pointsUpdatePage.getAlcoholInput()).toMatch('5');
        pointsUpdatePage.setNotesInput('notes');
        expect(pointsUpdatePage.getNotesInput()).toMatch('notes');
        pointsUpdatePage.userSelectLastOption();
        pointsUpdatePage.save();
        expect(pointsUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

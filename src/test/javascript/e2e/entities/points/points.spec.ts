import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PointsComponentsPage, PointsUpdatePage } from './points.page-object';

describe('Points e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let pointsUpdatePage: PointsUpdatePage;
    let pointsComponentsPage: PointsComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Points', async () => {
        await navBarPage.goToEntity('points');
        pointsComponentsPage = new PointsComponentsPage();
        expect(await pointsComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.points.home.title/);
    });

    it('should load create Points page', async () => {
        await pointsComponentsPage.clickOnCreateButton();
        pointsUpdatePage = new PointsUpdatePage();
        expect(await pointsUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.points.home.createOrEditLabel/);
        await pointsUpdatePage.cancel();
    });

    it('should create and save Points', async () => {
        await pointsComponentsPage.clickOnCreateButton();
        await pointsUpdatePage.setDateInput('2000-12-31');
        expect(await pointsUpdatePage.getDateInput()).toMatch('2000-12-31');
        await pointsUpdatePage.setExerciseInput('5');
        expect(await pointsUpdatePage.getExerciseInput()).toMatch('5');
        await pointsUpdatePage.setMealsInput('5');
        expect(await pointsUpdatePage.getMealsInput()).toMatch('5');
        await pointsUpdatePage.setAlcoholInput('5');
        expect(await pointsUpdatePage.getAlcoholInput()).toMatch('5');
        await pointsUpdatePage.setNotesInput('notes');
        expect(await pointsUpdatePage.getNotesInput()).toMatch('notes');
        await pointsUpdatePage.userSelectLastOption();
        await pointsUpdatePage.save();
        expect(await pointsUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});

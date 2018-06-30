import { browser, protractor } from 'protractor';
import { NavBarPage } from '../../page-objects/jhi-page-objects';
import { WeightComponentsPage, WeightUpdatePage } from './weight.page-object';

describe('Weight e2e test', () => {
    let navBarPage: NavBarPage;
    let weightUpdatePage: WeightUpdatePage;
    let weightComponentsPage: WeightComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Weights', () => {
        navBarPage.goToEntity('weight');
        weightComponentsPage = new WeightComponentsPage();
        expect(weightComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.weight.home.title/);
    });

    it('should load create Weight page', () => {
        weightComponentsPage.clickOnCreateButton();
        weightUpdatePage = new WeightUpdatePage();
        expect(weightUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.weight.home.createOrEditLabel/);
        weightUpdatePage.cancel();
    });

    it('should create and save Weights', () => {
        weightComponentsPage.clickOnCreateButton();
        //weightUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        //expect(weightUpdatePage.getTimestampInput()).toContain('2001-01-01T02:30');
        weightUpdatePage.setWeightInput('5');
        expect(weightUpdatePage.getWeightInput()).toMatch('5');
        weightUpdatePage.userSelectLastOption();
        weightUpdatePage.save();
        expect(weightUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

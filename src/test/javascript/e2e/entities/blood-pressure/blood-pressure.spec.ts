import { browser, protractor } from 'protractor';
import { NavBarPage } from '../../page-objects/jhi-page-objects';
import { BloodPressureComponentsPage, BloodPressureUpdatePage } from './blood-pressure.page-object';

describe('BloodPressure e2e test', () => {
    let navBarPage: NavBarPage;
    let bloodPressureUpdatePage: BloodPressureUpdatePage;
    let bloodPressureComponentsPage: BloodPressureComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load BloodPressures', () => {
        navBarPage.goToEntity('blood-pressure');
        bloodPressureComponentsPage = new BloodPressureComponentsPage();
        expect(bloodPressureComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.bloodPressure.home.title/);
    });

    it('should load create BloodPressure page', () => {
        bloodPressureComponentsPage.clickOnCreateButton();
        bloodPressureUpdatePage = new BloodPressureUpdatePage();
        expect(bloodPressureUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.bloodPressure.home.createOrEditLabel/);
        bloodPressureUpdatePage.cancel();
    });

    it('should create and save BloodPressures', () => {
        bloodPressureComponentsPage.clickOnCreateButton();
        bloodPressureUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(bloodPressureUpdatePage.getTimestampInput()).toContain('2001-01-01T02:30');
        bloodPressureUpdatePage.setSystolicInput('5');
        expect(bloodPressureUpdatePage.getSystolicInput()).toMatch('5');
        bloodPressureUpdatePage.setDiastolicInput('5');
        expect(bloodPressureUpdatePage.getDiastolicInput()).toMatch('5');
        bloodPressureUpdatePage.userSelectLastOption();
        bloodPressureUpdatePage.save();
        expect(bloodPressureUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

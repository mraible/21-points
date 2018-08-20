import { browser, ExpectedConditions as ec, protractor } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BloodPressureComponentsPage, BloodPressureUpdatePage } from './blood-pressure.page-object';

describe('BloodPressure e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let bloodPressureUpdatePage: BloodPressureUpdatePage;
    let bloodPressureComponentsPage: BloodPressureComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load BloodPressures', async () => {
        await navBarPage.goToEntity('blood-pressure');
        bloodPressureComponentsPage = new BloodPressureComponentsPage();
        expect(await bloodPressureComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.bloodPressure.home.title/);
    });

    it('should load create BloodPressure page', async () => {
        await bloodPressureComponentsPage.clickOnCreateButton();
        bloodPressureUpdatePage = new BloodPressureUpdatePage();
        expect(await bloodPressureUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.bloodPressure.home.createOrEditLabel/);
        await bloodPressureUpdatePage.cancel();
    });

    it('should create and save BloodPressures', async () => {
        await bloodPressureComponentsPage.clickOnCreateButton();
        await bloodPressureUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(await bloodPressureUpdatePage.getTimestampInput()).toContain('2001-01-01T02:30');
        await bloodPressureUpdatePage.setSystolicInput('5');
        expect(await bloodPressureUpdatePage.getSystolicInput()).toMatch('5');
        await bloodPressureUpdatePage.setDiastolicInput('5');
        expect(await bloodPressureUpdatePage.getDiastolicInput()).toMatch('5');
        await bloodPressureUpdatePage.userSelectLastOption();
        await bloodPressureUpdatePage.save();
        expect(await bloodPressureUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});

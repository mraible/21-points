import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PreferencesComponentsPage, PreferencesUpdatePage } from './preferences.page-object';

describe('Preferences e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let preferencesUpdatePage: PreferencesUpdatePage;
    let preferencesComponentsPage: PreferencesComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Preferences', async () => {
        await navBarPage.goToEntity('preferences');
        preferencesComponentsPage = new PreferencesComponentsPage();
        expect(await preferencesComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.preferences.home.title/);
    });

    it('should load create Preferences page', async () => {
        await preferencesComponentsPage.clickOnCreateButton();
        preferencesUpdatePage = new PreferencesUpdatePage();
        expect(await preferencesUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.preferences.home.createOrEditLabel/);
        await preferencesUpdatePage.cancel();
    });

    it('should create and save Preferences', async () => {
        await preferencesComponentsPage.clickOnCreateButton();
        await preferencesUpdatePage.setWeeklyGoalInput('5');
        expect(await preferencesUpdatePage.getWeeklyGoalInput()).toMatch('5');
        await preferencesUpdatePage.weightUnitsSelectLastOption();
        await preferencesUpdatePage.userSelectLastOption();
        await preferencesUpdatePage.save();
        expect(await preferencesUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});

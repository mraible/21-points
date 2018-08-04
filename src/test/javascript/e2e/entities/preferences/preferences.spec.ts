import { browser } from 'protractor';
import { NavBarPage } from '../../page-objects/jhi-page-objects';
import { PreferencesComponentsPage, PreferencesUpdatePage } from './preferences.page-object';

describe('Preferences e2e test', () => {
    let navBarPage: NavBarPage;
    let preferencesUpdatePage: PreferencesUpdatePage;
    let preferencesComponentsPage: PreferencesComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Preferences', () => {
        navBarPage.goToEntity('preferences');
        preferencesComponentsPage = new PreferencesComponentsPage();
        expect(preferencesComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.preferences.home.title/);
    });

    it('should load create Preferences page', () => {
        preferencesComponentsPage.clickOnCreateButton();
        preferencesUpdatePage = new PreferencesUpdatePage();
        expect(preferencesUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.preferences.home.createOrEditLabel/);
        preferencesUpdatePage.cancel();
    });

    it('should create and save Preferences', () => {
        preferencesComponentsPage.clickOnCreateButton();
        preferencesUpdatePage.setWeeklyGoalInput('10');
        expect(preferencesUpdatePage.getWeeklyGoalInput()).toMatch('10');
        preferencesUpdatePage.weightUnitsSelectLastOption();
        preferencesUpdatePage.userSelectLastOption();
        preferencesUpdatePage.save();
        expect(preferencesUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

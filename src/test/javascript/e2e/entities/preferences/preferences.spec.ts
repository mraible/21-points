import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PreferencesComponentsPage, PreferencesDeleteDialog, PreferencesUpdatePage } from './preferences.page-object';

describe('Preferences e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let preferencesUpdatePage: PreferencesUpdatePage;
    let preferencesComponentsPage: PreferencesComponentsPage;
    let preferencesDeleteDialog: PreferencesDeleteDialog;

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
        expect(await preferencesUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.preferences.home.createLabel/);
        await preferencesUpdatePage.cancel();
    });

    it('should create and save Preferences', async () => {
        await preferencesComponentsPage.clickOnCreateButton();
        await preferencesUpdatePage.setWeeklyGoalInput('10');
        expect(await preferencesUpdatePage.getWeeklyGoalInput()).toMatch('10');
        await preferencesUpdatePage.weightUnitsSelectLastOption();
        await preferencesUpdatePage.userSelectLastOption();
        await preferencesUpdatePage.save();
        expect(await preferencesUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last Preferences', async () => {
        const nbButtonsBeforeDelete = await preferencesComponentsPage.countDeleteButtons();
        await preferencesComponentsPage.clickOnLastDeleteButton();

        preferencesDeleteDialog = new PreferencesDeleteDialog();
        expect(await preferencesDeleteDialog.getDialogTitle()).toMatch(/twentyOnePointsApp.preferences.delete.question/);
        await preferencesDeleteDialog.clickOnConfirmButton();

        expect(await preferencesComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});

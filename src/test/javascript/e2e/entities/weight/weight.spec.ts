import { browser, ExpectedConditions as ec, protractor } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { WeightComponentsPage, WeightDeleteDialog, WeightUpdatePage } from './weight.page-object';

describe('Weight e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let weightUpdatePage: WeightUpdatePage;
    let weightComponentsPage: WeightComponentsPage;
    let weightDeleteDialog: WeightDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Weights', async () => {
        await navBarPage.goToEntity('weight');
        weightComponentsPage = new WeightComponentsPage();
        expect(await weightComponentsPage.getTitle()).toMatch(/twentyOnePointsApp.weight.home.title/);
    });

    it('should load create Weight page', async () => {
        await weightComponentsPage.clickOnCreateButton();
        weightUpdatePage = new WeightUpdatePage();
        expect(await weightUpdatePage.getPageTitle()).toMatch(/twentyOnePointsApp.weight.home.createLabel/);
        await weightUpdatePage.cancel();
    });

    it('should create and save Weights', async () => {
        await weightComponentsPage.clickOnCreateButton();
        await weightUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(await weightUpdatePage.getTimestampInput()).toContain('2001-01-01T02:30');
        await weightUpdatePage.setWeightInput('5');
        expect(await weightUpdatePage.getWeightInput()).toMatch('5');
        await weightUpdatePage.userSelectLastOption();
        await weightUpdatePage.save();
        expect(await weightUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last Weight', async () => {
        const nbButtonsBeforeDelete = await weightComponentsPage.countDeleteButtons();
        await weightComponentsPage.clickOnLastDeleteButton();

        weightDeleteDialog = new WeightDeleteDialog();
        expect(await weightDeleteDialog.getDialogTitle()).toMatch(/twentyOnePointsApp.weight.delete.question/);
        await weightDeleteDialog.clickOnConfirmButton();

        expect(await weightComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});

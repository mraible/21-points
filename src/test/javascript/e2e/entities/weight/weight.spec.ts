/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { WeightComponentsPage, WeightDeleteDialog, WeightUpdatePage } from './weight.page-object';

const expect = chai.expect;

describe('Weight e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let weightUpdatePage: WeightUpdatePage;
    let weightComponentsPage: WeightComponentsPage;
    let weightDeleteDialog: WeightDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Weights', async () => {
        await navBarPage.goToEntity('weight');
        weightComponentsPage = new WeightComponentsPage();
        expect(await weightComponentsPage.getTitle()).to.eq('twentyOnePointsApp.weight.home.title');
    });

    it('should load create Weight page', async () => {
        await weightComponentsPage.clickOnCreateButton();
        weightUpdatePage = new WeightUpdatePage();
        expect(await weightUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.weight.home.createOrEditLabel');
        await weightUpdatePage.cancel();
    });

    it('should create and save Weights', async () => {
        const nbButtonsBeforeCreate = await weightComponentsPage.countDeleteButtons();

        await weightComponentsPage.clickOnCreateButton();
        await promise.all([
            weightUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            weightUpdatePage.setWeightInput('5'),
            weightUpdatePage.userSelectLastOption()
        ]);
        expect(await weightUpdatePage.getTimestampInput()).to.contain('2001-01-01T02:30');
        expect(await weightUpdatePage.getWeightInput()).to.eq('5');
        await weightUpdatePage.save();
        expect(await weightUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await weightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Weight', async () => {
        const nbButtonsBeforeDelete = await weightComponentsPage.countDeleteButtons();
        await weightComponentsPage.clickOnLastDeleteButton();

        weightDeleteDialog = new WeightDeleteDialog();
        expect(await weightDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.weight.delete.question');
        await weightDeleteDialog.clickOnConfirmButton();

        expect(await weightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});

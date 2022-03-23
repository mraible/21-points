import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { WeightComponentsPage, WeightDeleteDialog, WeightUpdatePage } from './weight.page-object';

const expect = chai.expect;

describe('Weight e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let weightComponentsPage: WeightComponentsPage;
  let weightUpdatePage: WeightUpdatePage;
  let weightDeleteDialog: WeightDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Weights', async () => {
    await navBarPage.goToEntity('weight');
    weightComponentsPage = new WeightComponentsPage();
    await browser.wait(ec.visibilityOf(weightComponentsPage.title), 5000);
    expect(await weightComponentsPage.getTitle()).to.eq('twentyOnePointsApp.weight.home.title');
    await browser.wait(ec.or(ec.visibilityOf(weightComponentsPage.entities), ec.visibilityOf(weightComponentsPage.noResult)), 1000);
  });

  it('should load create Weight page', async () => {
    await weightComponentsPage.clickOnCreateButton();
    weightUpdatePage = new WeightUpdatePage();
    expect(await weightUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.weight.home.createLabel');
    await weightUpdatePage.cancel();
  });

  it('should create and save Weights', async () => {
    const nbButtonsBeforeCreate = await weightComponentsPage.countDeleteButtons();

    await weightComponentsPage.clickOnCreateButton();

    await promise.all([
      weightUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      weightUpdatePage.setWeightInput('5'),
      weightUpdatePage.userSelectLastOption(),
    ]);

    await weightUpdatePage.save();
    expect(await weightUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await weightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Weight', async () => {
    const nbButtonsBeforeDelete = await weightComponentsPage.countDeleteButtons();
    await weightComponentsPage.clickOnLastDeleteButton();

    weightDeleteDialog = new WeightDeleteDialog();
    expect(await weightDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.weight.delete.question');
    await weightDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(weightComponentsPage.title), 5000);

    expect(await weightComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

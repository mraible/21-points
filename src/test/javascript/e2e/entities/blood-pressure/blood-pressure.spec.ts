import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BloodPressureComponentsPage, BloodPressureDeleteDialog, BloodPressureUpdatePage } from './blood-pressure.page-object';

const expect = chai.expect;

describe('BloodPressure e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bloodPressureComponentsPage: BloodPressureComponentsPage;
  let bloodPressureUpdatePage: BloodPressureUpdatePage;
  let bloodPressureDeleteDialog: BloodPressureDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BloodPressures', async () => {
    await navBarPage.goToEntity('blood-pressure');
    bloodPressureComponentsPage = new BloodPressureComponentsPage();
    await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 5000);
    expect(await bloodPressureComponentsPage.getTitle()).to.eq('twentyOnePointsApp.bloodPressure.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(bloodPressureComponentsPage.entities), ec.visibilityOf(bloodPressureComponentsPage.noResult)),
      1000
    );
  });

  it('should load create BloodPressure page', async () => {
    await bloodPressureComponentsPage.clickOnCreateButton();
    bloodPressureUpdatePage = new BloodPressureUpdatePage();
    expect(await bloodPressureUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.bloodPressure.home.createLabel');
    await bloodPressureUpdatePage.cancel();
  });

  it('should create and save BloodPressures', async () => {
    const nbButtonsBeforeCreate = await bloodPressureComponentsPage.countDeleteButtons();

    await bloodPressureComponentsPage.clickOnCreateButton();

    await promise.all([
      bloodPressureUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      bloodPressureUpdatePage.setSystolicInput('5'),
      bloodPressureUpdatePage.setDiastolicInput('5'),
      bloodPressureUpdatePage.userSelectLastOption(),
    ]);

    await bloodPressureUpdatePage.save();
    expect(await bloodPressureUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BloodPressure', async () => {
    const nbButtonsBeforeDelete = await bloodPressureComponentsPage.countDeleteButtons();
    await bloodPressureComponentsPage.clickOnLastDeleteButton();

    bloodPressureDeleteDialog = new BloodPressureDeleteDialog();
    expect(await bloodPressureDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.bloodPressure.delete.question');
    await bloodPressureDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 5000);

    expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

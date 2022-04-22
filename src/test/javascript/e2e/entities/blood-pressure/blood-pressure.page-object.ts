import { element, by, ElementFinder } from 'protractor';

export class BloodPressureComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-blood-pressure div table .btn-danger'));
  title = element.all(by.css('jhi-blood-pressure div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class BloodPressureUpdatePage {
  pageTitle = element(by.id('jhi-blood-pressure-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  timestampInput = element(by.id('field_timestamp'));
  systolicInput = element(by.id('field_systolic'));
  diastolicInput = element(by.id('field_diastolic'));

  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setTimestampInput(timestamp: string): Promise<void> {
    await this.timestampInput.sendKeys(timestamp);
  }

  async getTimestampInput(): Promise<string> {
    return await this.timestampInput.getAttribute('value');
  }

  async setSystolicInput(systolic: string): Promise<void> {
    await this.systolicInput.sendKeys(systolic);
  }

  async getSystolicInput(): Promise<string> {
    return await this.systolicInput.getAttribute('value');
  }

  async setDiastolicInput(diastolic: string): Promise<void> {
    await this.diastolicInput.sendKeys(diastolic);
  }

  async getDiastolicInput(): Promise<string> {
    return await this.diastolicInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class BloodPressureDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-bloodPressure-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-bloodPressure'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

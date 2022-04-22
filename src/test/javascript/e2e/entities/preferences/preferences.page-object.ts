import { element, by, ElementFinder } from 'protractor';

export class PreferencesComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-preferences div table .btn-danger'));
  title = element.all(by.css('jhi-preferences div h2#page-heading span')).first();
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

export class PreferencesUpdatePage {
  pageTitle = element(by.id('jhi-preferences-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  weeklyGoalInput = element(by.id('field_weeklyGoal'));
  weightUnitsSelect = element(by.id('field_weightUnits'));

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

  async setWeeklyGoalInput(weeklyGoal: string): Promise<void> {
    await this.weeklyGoalInput.sendKeys(weeklyGoal);
  }

  async getWeeklyGoalInput(): Promise<string> {
    return await this.weeklyGoalInput.getAttribute('value');
  }

  async setWeightUnitsSelect(weightUnits: string): Promise<void> {
    await this.weightUnitsSelect.sendKeys(weightUnits);
  }

  async getWeightUnitsSelect(): Promise<string> {
    return await this.weightUnitsSelect.element(by.css('option:checked')).getText();
  }

  async weightUnitsSelectLastOption(): Promise<void> {
    await this.weightUnitsSelect.all(by.tagName('option')).last().click();
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

export class PreferencesDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-preferences-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-preferences'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

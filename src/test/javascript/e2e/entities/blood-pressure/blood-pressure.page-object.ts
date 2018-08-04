import { element, by, promise, ElementFinder } from 'protractor';

export class BloodPressureComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-blood-pressure div h2#page-heading span')).first();

    clickOnCreateButton(): promise.Promise<void> {
        return this.createButton.click();
    }

    getTitle(): any {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class BloodPressureUpdatePage {
    pageTitle = element(by.id('jhi-blood-pressure-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    timestampInput = element(by.id('field_timestamp'));
    systolicInput = element(by.id('field_systolic'));
    diastolicInput = element(by.id('field_diastolic'));
    userSelect = element(by.id('field_user'));

    getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    setTimestampInput(timestamp): promise.Promise<void> {
        return this.timestampInput.sendKeys(timestamp);
    }

    getTimestampInput() {
        return this.timestampInput.getAttribute('value');
    }

    setSystolicInput(systolic): promise.Promise<void> {
        return this.systolicInput.sendKeys(systolic);
    }

    getSystolicInput() {
        return this.systolicInput.getAttribute('value');
    }

    setDiastolicInput(diastolic): promise.Promise<void> {
        return this.diastolicInput.sendKeys(diastolic);
    }

    getDiastolicInput() {
        return this.diastolicInput.getAttribute('value');
    }

    userSelectLastOption(): promise.Promise<void> {
        return this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    userSelectOption(option): promise.Promise<void> {
        return this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    save(): promise.Promise<void> {
        return this.saveButton.click();
    }

    cancel(): promise.Promise<void> {
        return this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

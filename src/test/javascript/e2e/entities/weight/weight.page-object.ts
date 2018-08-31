import { element, by, ElementFinder } from 'protractor';

export class WeightComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-weight div h2#page-heading')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class WeightUpdatePage {
    pageTitle = element(by.id('jhi-weight-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    timestampInput = element(by.id('field_timestamp'));
    weightInput = element(by.id('field_weight'));
    userSelect = element(by.id('field_user'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setTimestampInput(timestamp) {
        await this.timestampInput.sendKeys(timestamp);
    }

    async getTimestampInput() {
        return this.timestampInput.getAttribute('value');
    }

    async setWeightInput(weight) {
        await this.weightInput.sendKeys(weight);
    }

    async getWeightInput() {
        return this.weightInput.getAttribute('value');
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectOption(option) {
        await this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    async getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

import { element, by, promise, ElementFinder } from 'protractor';

export class PreferencesComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-preferences div h2#page-heading span')).first();

    clickOnCreateButton(): promise.Promise<void> {
        return this.createButton.click();
    }

    getTitle(): any {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PreferencesUpdatePage {
    pageTitle = element(by.id('jhi-preferences-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    weeklyGoalInput = element(by.id('field_weeklyGoal'));
    weightUnitsSelect = element(by.id('field_weightUnits'));
    userSelect = element(by.id('field_user'));

    getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    setWeeklyGoalInput(weeklyGoal): promise.Promise<void> {
        return this.weeklyGoalInput.sendKeys(weeklyGoal);
    }

    getWeeklyGoalInput() {
        return this.weeklyGoalInput.getAttribute('value');
    }

    setWeightUnitsSelect(weightUnits): promise.Promise<void> {
        return this.weightUnitsSelect.sendKeys(weightUnits);
    }

    getWeightUnitsSelect() {
        return this.weightUnitsSelect.element(by.css('option:checked')).getText();
    }

    weightUnitsSelectLastOption(): promise.Promise<void> {
        return this.weightUnitsSelect
            .all(by.tagName('option'))
            .last()
            .click();
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

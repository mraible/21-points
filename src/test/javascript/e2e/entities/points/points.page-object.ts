import { element, by, promise, ElementFinder } from 'protractor';

export class PointsComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-points div h2#page-heading span')).first();

    clickOnCreateButton(): promise.Promise<void> {
        return this.createButton.click();
    }

    getTitle(): any {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PointsUpdatePage {
    pageTitle = element(by.id('jhi-points-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    dateInput = element(by.id('field_date'));
    exerciseInput = element(by.id('field_exercise'));
    mealsInput = element(by.id('field_meals'));
    alcoholInput = element(by.id('field_alcohol'));
    notesInput = element(by.id('field_notes'));
    userSelect = element(by.id('field_user'));

    getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    setDateInput(date): promise.Promise<void> {
        return this.dateInput.sendKeys(date);
    }

    getDateInput() {
        return this.dateInput.getAttribute('value');
    }

    setExerciseInput(exercise): promise.Promise<void> {
        return this.exerciseInput.sendKeys(exercise);
    }

    getExerciseInput() {
        return this.exerciseInput.getAttribute('value');
    }

    setMealsInput(meals): promise.Promise<void> {
        return this.mealsInput.sendKeys(meals);
    }

    getMealsInput() {
        return this.mealsInput.getAttribute('value');
    }

    setAlcoholInput(alcohol): promise.Promise<void> {
        return this.alcoholInput.sendKeys(alcohol);
    }

    getAlcoholInput() {
        return this.alcoholInput.getAttribute('value');
    }

    setNotesInput(notes): promise.Promise<void> {
        return this.notesInput.sendKeys(notes);
    }

    getNotesInput() {
        return this.notesInput.getAttribute('value');
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

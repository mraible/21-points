import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Points e2e test', () => {

    let navBarPage: NavBarPage;
    let pointsDialogPage: PointsDialogPage;
    let pointsComponentsPage: PointsComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Points', () => {
        navBarPage.goToEntity('points');
        pointsComponentsPage = new PointsComponentsPage();
        expect(pointsComponentsPage.getTitle())
            .toMatch(/twentyOnePointsApp.points.home.title/);

    });

    it('should load create Points dialog', () => {
        pointsComponentsPage.clickOnCreateButton();
        pointsDialogPage = new PointsDialogPage();
        expect(pointsDialogPage.getModalTitle())
            .toMatch(/twentyOnePointsApp.points.home.createOrEditLabel/);
        pointsDialogPage.close();
    });

    it('should create and save Points', () => {
        pointsComponentsPage.clickOnCreateButton();
        pointsDialogPage.setDateInput('2000-12-31');
        expect(pointsDialogPage.getDateInput()).toMatch('2000-12-31');
        pointsDialogPage.setExerciseInput('5');
        expect(pointsDialogPage.getExerciseInput()).toMatch('5');
        pointsDialogPage.setMealsInput('5');
        expect(pointsDialogPage.getMealsInput()).toMatch('5');
        pointsDialogPage.setAlcoholInput('5');
        expect(pointsDialogPage.getAlcoholInput()).toMatch('5');
        pointsDialogPage.setNotesInput('notes');
        expect(pointsDialogPage.getNotesInput()).toMatch('notes');
        pointsDialogPage.userSelectLastOption();
        pointsDialogPage.save();
        expect(pointsDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PointsComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-points div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PointsDialogPage {
    modalTitle = element(by.css('h4#myPointsLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    dateInput = element(by.css('input#field_date'));
    exerciseInput = element(by.css('input#field_exercise'));
    mealsInput = element(by.css('input#field_meals'));
    alcoholInput = element(by.css('input#field_alcohol'));
    notesInput = element(by.css('input#field_notes'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setDateInput = function(date) {
        this.dateInput.sendKeys(date);
    };

    getDateInput = function() {
        return this.dateInput.getAttribute('value');
    };

    setExerciseInput = function(exercise) {
        this.exerciseInput.sendKeys(exercise);
    };

    getExerciseInput = function() {
        return this.exerciseInput.getAttribute('value');
    };

    setMealsInput = function(meals) {
        this.mealsInput.sendKeys(meals);
    };

    getMealsInput = function() {
        return this.mealsInput.getAttribute('value');
    };

    setAlcoholInput = function(alcohol) {
        this.alcoholInput.sendKeys(alcohol);
    };

    getAlcoholInput = function() {
        return this.alcoholInput.getAttribute('value');
    };

    setNotesInput = function(notes) {
        this.notesInput.sendKeys(notes);
    };

    getNotesInput = function() {
        return this.notesInput.getAttribute('value');
    };

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    };

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    };

    getUserSelect = function() {
        return this.userSelect;
    };

    getUserSelectedOption = function() {
        return this.userSelect.element(by.css('option:checked')).getText();
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}

import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Preferences e2e test', () => {

    let navBarPage: NavBarPage;
    let preferencesDialogPage: PreferencesDialogPage;
    let preferencesComponentsPage: PreferencesComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Preferences', () => {
        entityMenu.click();
        element.all(by.css('[routerLink="preferences"]')).first().click().then(() => {
            const expectVal = /twentyOnePointsApp.preferences.home.title/;
            element.all(by.css('h2')).first().getAttribute('jhiTranslate').then((value) => {
                expect(value).toMatch(expectVal);
            });
        });
    });

    it('should load create Preferences dialog', () => {
        element(by.css('button.create-preferences')).click().then(() => {
            const expectVal = /twentyOnePointsApp.preferences.home.createLabel/;
            element.all(by.css('h4.modal-title')).first().getAttribute('jhiTranslate').then((value) => {
                expect(value).toMatch(expectVal);
            });

            element(by.css('button.close')).click();
        });
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PreferencesComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-preferences div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PreferencesDialogPage {
    modalTitle = element(by.css('h4#myPreferencesLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    weekly_goalInput = element(by.css('input#field_weekly_goal'));
    weight_unitsSelect = element(by.css('select#field_weight_units'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setWeekly_goalInput = function(weekly_goal) {
        this.weekly_goalInput.sendKeys(weekly_goal);
    };

    getWeekly_goalInput = function() {
        return this.weekly_goalInput.getAttribute('value');
    };

    setWeight_unitsSelect = function(weight_units) {
        this.weight_unitsSelect.sendKeys(weight_units);
    };

    getWeight_unitsSelect = function() {
        return this.weight_unitsSelect.element(by.css('option:checked')).getText();
    };

    weight_unitsSelectLastOption = function() {
        this.weight_unitsSelect.all(by.tagName('option')).last().click();
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

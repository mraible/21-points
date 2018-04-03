import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('BloodPressure e2e test', () => {

    let navBarPage: NavBarPage;
    let bloodPressureDialogPage: BloodPressureDialogPage;
    let bloodPressureComponentsPage: BloodPressureComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load BloodPressures', () => {
        entityMenu.click();
        element.all(by.css('[routerLink="blood-pressure"]')).first().click().then(() => {
            const expectVal = /twentyOnePointsApp.bloodPressure.home.title/;
            element.all(by.css('h2')).first().getAttribute('jhiTranslate').then((value) => {
                expect(value).toMatch(expectVal);
            });
        });
    });

    it('should load create BloodPressure dialog', () => {
        element(by.css('button.create-blood-pressure')).click().then(() => {
            const expectVal = /twentyOnePointsApp.bloodPressure.home.createLabel/;
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

export class BloodPressureComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-blood-pressure div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class BloodPressureDialogPage {
    modalTitle = element(by.css('h4#myBloodPressureLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    timestampInput = element(by.css('input#field_timestamp'));
    systolicInput = element(by.css('input#field_systolic'));
    diastolicInput = element(by.css('input#field_diastolic'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTimestampInput = function(timestamp) {
        this.timestampInput.sendKeys(timestamp);
    };

    getTimestampInput = function() {
        return this.timestampInput.getAttribute('value');
    };

    setSystolicInput = function(systolic) {
        this.systolicInput.sendKeys(systolic);
    };

    getSystolicInput = function() {
        return this.systolicInput.getAttribute('value');
    };

    setDiastolicInput = function(diastolic) {
        this.diastolicInput.sendKeys(diastolic);
    };

    getDiastolicInput = function() {
        return this.diastolicInput.getAttribute('value');
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

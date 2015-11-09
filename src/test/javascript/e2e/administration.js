'use strict';

describe('administration', function () {

    beforeAll(function () {
        browser.get('/');
        browser.driver.wait(protractor.until.elementIsVisible(element(by.css('h1'))));

        element.all(by.css('[ui-sref="login"]')).get(1).click();

        element(by.model('username')).sendKeys('admin');
        element(by.model('password')).sendKeys('admin');
        element(by.css('button[type=submit]')).click();
    });

    beforeEach(function () {
        element(by.id('admin-menu')).click();
    });

    it('should load user tracker', function () {
        element(by.css('[ui-sref="tracker"]')).click();
        expect(element.all(by.css('h2')).first().getText()).toMatch(/Real-time user activities/);
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="metrics"]')).click();
        expect(element.all(by.css('h2')).first().getText()).toMatch(/Application Metrics/);
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="health"]')).click();
        expect(element.all(by.css('h2')).first().getText()).toMatch(/Health checks/);
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="configuration"]')).click();
        expect(element.all(by.css('h2')).first().getText()).toMatch(/Configuration/);
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="audits"]')).click();
        expect(element.all(by.css('h2')).first().getText()).toMatch(/Audits/);
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="logs"]')).click();
        expect(element.all(by.css('h2')).first().getText()).toMatch(/Logs/);
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="docs"]')).click();
        expect(element.all(by.css('iframe')).isDisplayed()).toBeTruthy();
    });

    afterAll(function () {
        element(by.id('account-menu')).click();
        element(by.id('logout')).click();
    });
});

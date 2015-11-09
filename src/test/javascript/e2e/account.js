'use strict';

describe('account', function () {

    beforeAll(function () {
        browser.get('/');
        browser.driver.wait(protractor.until.elementIsVisible(element(by.css('h1'))));
    });

    it('should fail to login with bad password', function () {
        expect(element.all(by.css('h1')).first().getText()).toMatch(/Welcome!/);
        element.all(by.css('[ui-sref="login"]')).get(1).click();

        element(by.model('username')).sendKeys('admin');
        element(by.model('password')).sendKeys('foo');
        element(by.css('button[type=submit]')).click();

        var error = $('.alert-danger').getText();
        expect(error).toMatch(/Authentication failed!/);
    });

    it('should login successfully with admin account', function () {
        expect(element.all(by.css('h1')).first().getText()).toMatch(/Authentication/);

        element(by.model('username')).clear().sendKeys('admin');
        element(by.model('password')).clear().sendKeys('admin');
        element(by.css('button[type=submit]')).click();

        expect(element.all(by.css('h1')).first().getText()).toMatch(/Hello, Administrator!/);
    });

    it('should be able to update settings', function () {
        element(by.id('account-menu')).click();
        element(by.css('[ui-sref="settings"]')).click();

        expect(element(by.css('h2')).getText()).toMatch(/User settings for \[admin\]/);
        element(by.css('button[type=submit]')).click();

        var message = $('.alert').getText();
        expect(message).toMatch(/Settings saved!/);
    });

    it('should be able to update password', function () {
        element(by.id('account-menu')).click();
        element(by.css('[ui-sref="password"]')).click();

        expect(element.all(by.css('h2')).first().getText()).toMatch(/Password for \[admin\]/);
        element(by.model('password')).sendKeys('newpassword');
        element(by.model('confirmPassword')).sendKeys('newpassword');
        element(by.css('button[type=submit]')).click();

        var message = $('.alert').getText();
        expect(message).toMatch(/Password changed!/);
        element(by.id('account-menu')).click();
        element(by.id('logout')).click();

        element.all(by.css('[ui-sref="login"]')).get(1).click();

        element(by.model('username')).sendKeys('admin');
        element(by.model('password')).sendKeys('newpassword');
        element(by.css('button[type=submit]')).click();

        element(by.id('account-menu')).click();
        element(by.css('[ui-sref="password"]')).click();
        // change back to default
        element(by.model('password')).clear().sendKeys('admin');
        element(by.model('confirmPassword')).clear().sendKeys('admin');
        element(by.css('button[type=submit]')).click();
    });

    afterAll(function () {
        element(by.id('account-menu')).click();
        element(by.id('logout')).click();
    });
});

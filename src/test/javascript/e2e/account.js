'use strict';

describe('account', function () {

    beforeEach(function () {
        browser.get('/');
    });

    it('should auto redirect to signin when location hash is empty', function () {
        expect(browser.getLocationAbsUrl()).toMatch("/access/signin");
    });

    it('should fail to login with bad password', function () {
        expect(element.all(by.css('h1')).first().getText()).toMatch(/Welcome!/);
        element(by.css('ui-sref="login"')).click();

        element(by.model('username')).sendKeys('admin');
        element(by.model('password')).sendKeys('foo');
        element(by.css('button[type=submit]')).click();

        var error = $('.alert-danger').getText();
        expect(error).toMatch(/Authentication failed!/);
    });

    it('should login successfully with admin account', function (done) {
        expect(element.all(by.css('h1')).first().getText()).toMatch(/Welcome/);
        element(by.css('ui-sref="login"')).click();

        element(by.model('username')).sendKeys('admin');
        element(by.model('password')).sendKeys('admin');
        element(by.css('button[type=submit]')).click();

        expect(element.all(by.css('h1')).first().getText()).toMatch(/Hello, Administrator!/);
    });
});

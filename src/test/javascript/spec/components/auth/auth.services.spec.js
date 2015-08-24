'use strict';

describe('Services Tests ', function () {

    beforeEach(module('21pointsApp'));

    describe('Auth', function () {
        var $httpBackend, spiedLocalStorageService, authService, spiedAuthServerProvider;

        beforeEach(inject(function($injector, localStorageService, Auth, AuthServerProvider) {
            $httpBackend = $injector.get('$httpBackend');
            spiedLocalStorageService = localStorageService;
            authService = Auth;
            spiedAuthServerProvider = AuthServerProvider;
            //Request on app init
            $httpBackend.whenGET(/api\/points-this-week\?cacheBuster=\d+/).respond({});
            $httpBackend.whenGET(/api\/my-preferences\?cacheBuster=\d+/).respond({});
            $httpBackend.whenGET(/api\/bp-by-days\/30\?cacheBuster=\d+/).respond({});
            $httpBackend.whenGET(/api\/weight-by-days\/30\?cacheBuster=\d+/).respond({});
            $httpBackend.whenGET('scripts/app/main/main.html').respond({});
            $httpBackend.whenGET('scripts/components/navbar/navbar.html').respond({});
            var globalJson = new RegExp('i18n\/.*\/global.json');
            var mainJson = new RegExp('i18n\/.*\/*.json');
            $httpBackend.whenGET(globalJson).respond({});
            $httpBackend.whenGET(mainJson).respond({});
          }));
        //make sure no expectations were missed in your tests.
        //(e.g. expectGET or expectPOST)
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

          it('should call LocalStorageService.clearAll on logout', function(){
            //GIVEN
            //Set spy
            spyOn(spiedLocalStorageService, "clearAll").and.callThrough();

            //WHEN
            authService.logout();
            //flush the backend to "execute" the request to do the expectedGET assertion.
            $httpBackend.flush();

            //THEN
            expect(spiedLocalStorageService.clearAll).toHaveBeenCalled();
          });

    });
});

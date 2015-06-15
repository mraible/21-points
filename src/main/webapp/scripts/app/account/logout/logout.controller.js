'use strict';

angular.module('21pointsApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });

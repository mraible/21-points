'use strict';

angular.module('21pointsApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });



'use strict';

angular.module('21pointsApp')
    .factory('BloodPressureSearch', function ($resource) {
        return $resource('api/_search/bloodPressures/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

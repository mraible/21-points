'use strict';

angular.module('21pointsApp')
    .factory('WeightSearch', function ($resource) {
        return $resource('api/_search/weights/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

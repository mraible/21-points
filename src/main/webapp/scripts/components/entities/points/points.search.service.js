'use strict';

angular.module('21pointsApp')
    .factory('PointsSearch', function ($resource) {
        return $resource('api/_search/pointss/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

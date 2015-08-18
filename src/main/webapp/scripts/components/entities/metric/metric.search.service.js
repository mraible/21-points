'use strict';

angular.module('21pointsApp')
    .factory('MetricSearch', function ($resource) {
        return $resource('api/_search/metrics/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

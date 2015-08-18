'use strict';

angular.module('21pointsApp')
    .factory('GoalSearch', function ($resource) {
        return $resource('api/_search/goals/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

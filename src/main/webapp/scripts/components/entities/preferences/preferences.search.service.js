'use strict';

angular.module('21pointsApp')
    .factory('PreferencesSearch', function ($resource) {
        return $resource('api/_search/preferencess/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

'use strict';

angular.module('21pointsApp')
    .factory('Preferences', function ($resource, DateUtils) {
        return $resource('api/preferencess/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });

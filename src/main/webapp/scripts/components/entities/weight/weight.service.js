'use strict';

angular.module('21pointsApp')
    .factory('Weight', function ($resource, DateUtils) {
        return $resource('api/weights/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.timestamp = DateUtils.convertDateTimeFromServer(data.timestamp);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });

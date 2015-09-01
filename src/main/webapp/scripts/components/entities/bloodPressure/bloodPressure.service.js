'use strict';

angular.module('21pointsApp')
    .factory('BloodPressure', function ($resource, DateUtils) {
        return $resource('api/bloodPressures/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'byMonth': { method: 'GET', isArray: false, url: 'api/bp-by-month/:month'},
            'last30Days': { method: 'GET', isArray: false, url: 'api/bp-by-days/30'},
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

'use strict';

angular.module('21pointsApp')
    .factory('Points', function ($resource, DateUtils) {
        return $resource('api/points/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'thisWeek': { method: 'GET', isArray: false, url: 'api/points-this-week'},
            'byMonth': { method: 'GET', isArray: false, url: 'api/points-by-month/:month'},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.date = DateUtils.convertLocaleDateFromServer(data.date);
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.date = DateUtils.convertLocaleDateToServer(data.date);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.date = DateUtils.convertLocaleDateToServer(data.date);
                    return angular.toJson(data);
                }
            }
        });
    });

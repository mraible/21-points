(function() {
    'use strict';
    angular
        .module('21PointsApp')
        .factory('Points', Points);

    Points.$inject = ['$resource', 'DateUtils'];

    function Points ($resource, DateUtils) {
        var resourceUrl =  'api/points/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'thisWeek': { method: 'GET', isArray: false, url: 'api/points-this-week'},
            'byMonth': { method: 'GET', isArray: false, url: 'api/points-by-month/:month'},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.date = DateUtils.convertLocalDateFromServer(data.date);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.date = DateUtils.convertLocalDateToServer(data.date);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.date = DateUtils.convertLocalDateToServer(data.date);
                    return angular.toJson(data);
                }
            }
        });
    }
})();

(function() {
    'use strict';
    angular
        .module('21PointsApp')
        .factory('BloodPressure', BloodPressure);

    BloodPressure.$inject = ['$resource', 'DateUtils'];

    function BloodPressure ($resource, DateUtils) {
        var resourceUrl =  'api/blood-pressures/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'byMonth': { method: 'GET', isArray: false, url: 'api/bp-by-month/:month'},
            'last30Days': { method: 'GET', isArray: false, url: 'api/bp-by-days/30'},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.timestamp = DateUtils.convertDateTimeFromServer(data.timestamp);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();

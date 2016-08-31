(function() {
    'use strict';
    angular
        .module('21PointsApp')
        .factory('Weight', Weight);

    Weight.$inject = ['$resource', 'DateUtils'];

    function Weight ($resource, DateUtils) {
        var resourceUrl =  'api/weights/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
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

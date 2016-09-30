(function() {
    'use strict';
    angular
        .module('21PointsApp')
        .factory('Preferences', Preferences);

    Preferences.$inject = ['$resource'];

    function Preferences ($resource) {
        var resourceUrl =  'api/preferences/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'user': { method: 'GET', isArray: false, url: '/api/my-preferences'},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();

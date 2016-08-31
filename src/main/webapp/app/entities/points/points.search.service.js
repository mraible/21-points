(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .factory('PointsSearch', PointsSearch);

    PointsSearch.$inject = ['$resource'];

    function PointsSearch($resource) {
        var resourceUrl =  'api/_search/points/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

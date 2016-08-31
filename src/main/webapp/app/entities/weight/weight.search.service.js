(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .factory('WeightSearch', WeightSearch);

    WeightSearch.$inject = ['$resource'];

    function WeightSearch($resource) {
        var resourceUrl =  'api/_search/weights/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .factory('BloodPressureSearch', BloodPressureSearch);

    BloodPressureSearch.$inject = ['$resource'];

    function BloodPressureSearch($resource) {
        var resourceUrl =  'api/_search/blood-pressures/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();

'use strict';

angular.module('21pointsApp')
    .factory('EntrySearch', function ($resource) {
        return $resource('api/_search/entrys/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });

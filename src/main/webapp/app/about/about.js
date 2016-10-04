(function() {
'use strict';

    angular.module('21PointsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('about', {
            parent: 'app',
            url: '/about',
            data: {
                roles: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/about/about.html'
                }
            },
            resolve: {
                aboutTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        });
    }
})();

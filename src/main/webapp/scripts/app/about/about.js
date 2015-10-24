'use strict';

angular.module('21pointsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('about', {
                parent: 'site',
                url: '/about',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/about/about.html'
                    }
                },
                resolve: {
                    aboutTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        return $translate.refresh();
                    }]
                }
            });
    });

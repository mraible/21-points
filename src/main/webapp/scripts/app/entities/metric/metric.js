'use strict';

angular.module('21pointsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('metric', {
                parent: 'entity',
                url: '/metric',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.metric.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/metric/metrics.html',
                        controller: 'MetricController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('metric');
                        return $translate.refresh();
                    }]
                }
            })
            .state('metricDetail', {
                parent: 'entity',
                url: '/metric/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.metric.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/metric/metric-detail.html',
                        controller: 'MetricDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('metric');
                        return $translate.refresh();
                    }]
                }
            });
    });

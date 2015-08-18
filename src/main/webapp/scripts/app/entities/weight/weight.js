'use strict';

angular.module('21pointsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('weight', {
                parent: 'entity',
                url: '/weights',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.weight.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/weight/weights.html',
                        controller: 'WeightController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('weight');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('weight.detail', {
                parent: 'entity',
                url: '/weight/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.weight.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/weight/weight-detail.html',
                        controller: 'WeightDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('weight');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Weight', function($stateParams, Weight) {
                        return Weight.get({id : $stateParams.id});
                    }]
                }
            })
            .state('weight.new', {
                parent: 'weight',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/weight/weight-dialog.html',
                        controller: 'WeightDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {timestamp: null, weight: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('weight', null, { reload: true });
                    }, function() {
                        $state.go('weight');
                    })
                }]
            })
            .state('weight.edit', {
                parent: 'weight',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/weight/weight-dialog.html',
                        controller: 'WeightDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Weight', function(Weight) {
                                return Weight.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('weight', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });

'use strict';

angular.module('21pointsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('goal', {
                parent: 'entity',
                url: '/goals',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.goal.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/goal/goals.html',
                        controller: 'GoalController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('goal');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('goal.detail', {
                parent: 'entity',
                url: '/goal/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.goal.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/goal/goal-detail.html',
                        controller: 'GoalDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('goal');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Goal', function($stateParams, Goal) {
                        return Goal.get({id : $stateParams.id});
                    }]
                }
            })
            .state('goal.new', {
                parent: 'goal',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/goal/goal-dialog.html',
                        controller: 'GoalDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {name: null, description: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('goal', null, { reload: true });
                    }, function() {
                        $state.go('goal');
                    })
                }]
            })
            .state('goal.edit', {
                parent: 'goal',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/goal/goal-dialog.html',
                        controller: 'GoalDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Goal', function(Goal) {
                                return Goal.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('goal', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });

'use strict';

angular.module('21pointsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('preferences', {
                parent: 'entity',
                url: '/preferencess',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.preferences.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/preferences/preferencess.html',
                        controller: 'PreferencesController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('preferences');
                        $translatePartialLoader.addPart('');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('preferences.detail', {
                parent: 'entity',
                url: '/preferences/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '21pointsApp.preferences.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/preferences/preferences-detail.html',
                        controller: 'PreferencesDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('preferences');
                        $translatePartialLoader.addPart('');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Preferences', function($stateParams, Preferences) {
                        return Preferences.get({id : $stateParams.id});
                    }]
                }
            })
            .state('preferences.new', {
                parent: 'preferences',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/preferences/preferences-dialog.html',
                        controller: 'PreferencesDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {weekly_goal: null, weight_units: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('preferences', null, { reload: true });
                    }, function() {
                        $state.go('preferences');
                    })
                }]
            })
            .state('preferences.edit', {
                parent: 'preferences',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/preferences/preferences-dialog.html',
                        controller: 'PreferencesDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Preferences', function(Preferences) {
                                return Preferences.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('preferences', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });

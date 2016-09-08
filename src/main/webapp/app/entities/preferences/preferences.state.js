(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('preferences', {
            parent: 'entity',
            url: '/preferences',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: '21PointsApp.preferences.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/preferences/preferences.html',
                    controller: 'PreferencesController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('preferences');
                    $translatePartialLoader.addPart('units');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('preferences-detail', {
            parent: 'entity',
            url: '/preferences/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: '21PointsApp.preferences.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/preferences/preferences-detail.html',
                    controller: 'PreferencesDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('preferences');
                    $translatePartialLoader.addPart('units');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Preferences', function($stateParams, Preferences) {
                    return Preferences.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'preferences',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('preferences-detail.edit', {
            parent: 'preferences-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/preferences/preferences-dialog.html',
                    controller: 'PreferencesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Preferences', function(Preferences) {
                            return Preferences.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('preferences.new', {
            parent: 'preferences',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/preferences/preferences-dialog.html',
                    controller: 'PreferencesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                weeklyGoal: null,
                                weightUnits: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('preferences', null, { reload: 'preferences' });
                }, function() {
                    $state.go('preferences');
                });
            }]
        })
        .state('preferences.edit', {
            parent: 'preferences',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/preferences/preferences-dialog.html',
                    controller: 'PreferencesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Preferences', function(Preferences) {
                            return Preferences.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('preferences', null, { reload: 'preferences' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('preferences.delete', {
            parent: 'preferences',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/preferences/preferences-delete-dialog.html',
                    controller: 'PreferencesDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Preferences', function(Preferences) {
                            return Preferences.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('preferences', null, { reload: 'preferences' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();

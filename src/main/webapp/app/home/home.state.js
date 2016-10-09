(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('home', {
            parent: 'app',
            url: '/',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    $translatePartialLoader.addPart('weight');
                    $translatePartialLoader.addPart('points');
                    $translatePartialLoader.addPart('bloodPressure');
                    $translatePartialLoader.addPart('preferences');
                    $translatePartialLoader.addPart('units');
                    return $translate.refresh();
                }]
            }
        })
        .state('points.add', {
            parent: 'home',
            url: 'add/points',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/points/points-dialog.html',
                    controller: 'PointsDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {date: null, exercise: null, meals: null, alcohol: null, notes: null, id: null};
                        }
                    }
                }).result.then(function() {
                    $state.go('home', null, { reload: true });
                }, function() {
                    $state.go('home');
                });
            }]
        })
        .state('weight.add', {
            parent: 'home',
            url: 'add/weight',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/weight/weight-dialog.html',
                    controller: 'WeightDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                timestamp: null,
                                weight: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('home', null, { reload: true });
                }, function() {
                    $state.go('home');
                });
            }]
        })
        .state('blood-pressure.add', {
            parent: 'home',
            url: 'add/bp',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/blood-pressure/blood-pressure-dialog.html',
                    controller: 'BloodPressureDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                timestamp: null,
                                systolic: null,
                                diastolic: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('home', null, { reload: true });
                }, function() {
                    $state.go('home');
                });
            }]
        })
        .state('preferences.add', {
            parent: 'home',
            url: 'add/preferences',
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
                        entity: ['Preferences', function (Preferences) {
                            return Preferences.user().$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('home', null, { reload: true });
                }, function() {
                    $state.go('home');
                });
            }]
        })
        .state('history', {
            parent: 'home',
            url: 'history',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'content@': {
                    templateUrl: 'app/home/history.html',
                    controller: 'CalendarController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('history.points', {
            parent: 'history',
            url: '/points/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/points/points-dialog.html',
                    controller: 'PointsDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Points', function(Points) {
                            return Points.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function(result) {
                    $state.go('history', null, { reload: true });
                }, function() {
                    $state.go('^');
                })
            }]
        })
        .state('history.bp', {
            parent: 'history',
            url: '/bp/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/blood-pressure/blood-pressure-dialog.html',
                    controller: 'BloodPressureDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['BloodPressure', function(BloodPressure) {
                            return BloodPressure.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function(result) {
                    $state.go('history', null, { reload: true });
                }, function() {
                    $state.go('^');
                })
            }]
        })
        .state('history.weight', {
            parent: 'history',
            url: '/weight/{id}',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/weight/weight-dialog.html',
                    controller: 'WeightDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Weight', function(Weight) {
                            return Weight.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function(result) {
                    $state.go('history', null, { reload: true });
                }, function() {
                    $state.go('^');
                })
            }]
        });
    }
})();

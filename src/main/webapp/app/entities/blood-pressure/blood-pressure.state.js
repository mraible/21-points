(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('blood-pressure', {
            parent: 'entity',
            url: '/blood-pressure',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: '21PointsApp.bloodPressure.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/blood-pressure/blood-pressures.html',
                    controller: 'BloodPressureController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('bloodPressure');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('blood-pressure-detail', {
            parent: 'entity',
            url: '/blood-pressure/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: '21PointsApp.bloodPressure.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/blood-pressure/blood-pressure-detail.html',
                    controller: 'BloodPressureDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('bloodPressure');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'BloodPressure', function($stateParams, BloodPressure) {
                    return BloodPressure.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'blood-pressure',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('blood-pressure-detail.edit', {
            parent: 'blood-pressure-detail',
            url: '/detail/edit',
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
                            return BloodPressure.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('blood-pressure.new', {
            parent: 'blood-pressure',
            url: '/new',
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
                    $state.go('blood-pressure', null, { reload: 'blood-pressure' });
                }, function() {
                    $state.go('blood-pressure');
                });
            }]
        })
        .state('blood-pressure.edit', {
            parent: 'blood-pressure',
            url: '/{id}/edit',
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
                            return BloodPressure.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('blood-pressure', null, { reload: 'blood-pressure' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('blood-pressure.delete', {
            parent: 'blood-pressure',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/blood-pressure/blood-pressure-delete-dialog.html',
                    controller: 'BloodPressureDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['BloodPressure', function(BloodPressure) {
                            return BloodPressure.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('blood-pressure', null, { reload: 'blood-pressure' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();

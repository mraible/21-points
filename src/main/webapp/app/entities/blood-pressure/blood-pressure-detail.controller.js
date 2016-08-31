(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('BloodPressureDetailController', BloodPressureDetailController);

    BloodPressureDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'BloodPressure', 'User'];

    function BloodPressureDetailController($scope, $rootScope, $stateParams, previousState, entity, BloodPressure, User) {
        var vm = this;

        vm.bloodPressure = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('21PointsApp:bloodPressureUpdate', function(event, result) {
            vm.bloodPressure = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();

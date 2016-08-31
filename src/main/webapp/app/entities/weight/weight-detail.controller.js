(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('WeightDetailController', WeightDetailController);

    WeightDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Weight', 'User'];

    function WeightDetailController($scope, $rootScope, $stateParams, previousState, entity, Weight, User) {
        var vm = this;

        vm.weight = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('21PointsApp:weightUpdate', function(event, result) {
            vm.weight = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();

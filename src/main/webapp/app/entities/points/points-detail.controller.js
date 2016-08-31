(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('PointsDetailController', PointsDetailController);

    PointsDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Points', 'User'];

    function PointsDetailController($scope, $rootScope, $stateParams, previousState, entity, Points, User) {
        var vm = this;

        vm.points = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('21PointsApp:pointsUpdate', function(event, result) {
            vm.points = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();

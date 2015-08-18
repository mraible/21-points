'use strict';

angular.module('21pointsApp').controller('WeightDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Weight', 'User',
        function($scope, $stateParams, $modalInstance, entity, Weight, User) {

        $scope.weight = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            Weight.get({id : id}, function(result) {
                $scope.weight = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('21pointsApp:weightUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.weight.id != null) {
                Weight.update($scope.weight, onSaveFinished);
            } else {
                Weight.save($scope.weight, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);

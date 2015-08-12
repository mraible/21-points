'use strict';

angular.module('21pointsApp').controller('GoalDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Goal', 'User',
        function($scope, $stateParams, $modalInstance, entity, Goal, User) {

        $scope.goal = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            Goal.get({id : id}, function(result) {
                $scope.goal = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('21pointsApp:goalUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.goal.id != null) {
                Goal.update($scope.goal, onSaveFinished);
            } else {
                Goal.save($scope.goal, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);

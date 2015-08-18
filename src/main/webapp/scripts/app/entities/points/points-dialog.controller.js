'use strict';

angular.module('21pointsApp').controller('PointsDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Points', 'User',
        function($scope, $stateParams, $modalInstance, entity, Points, User) {

        $scope.points = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            Points.get({id : id}, function(result) {
                $scope.points = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('21pointsApp:pointsUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.points.id != null) {
                Points.update($scope.points, onSaveFinished);
            } else {
                Points.save($scope.points, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);

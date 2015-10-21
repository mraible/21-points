'use strict';

angular.module('21pointsApp').controller('PointsDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Points', 'User',
        function ($scope, $stateParams, $modalInstance, entity, Points, User) {

            // defaults for new entries
            if (!entity.id) {
                entity.date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
                entity.exercise = 1;
                entity.meals = 1;
                entity.alcohol = 1;
            }

            $scope.points = entity;
            $scope.users = User.query();

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

            $scope.clear = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

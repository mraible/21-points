'use strict';

angular.module('21pointsApp').controller('PreferencesDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Preferences', 'User',
        function($scope, $stateParams, $modalInstance, entity, Preferences, User) {

        $scope.preferences = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            Preferences.get({id : id}, function(result) {
                $scope.preferences = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('21pointsApp:preferencesUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.preferences.id != null) {
                Preferences.update($scope.preferences, onSaveFinished);
            } else {
                Preferences.save($scope.preferences, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);

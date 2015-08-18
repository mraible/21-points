'use strict';

angular.module('21pointsApp')
    .controller('PreferencesDetailController', function ($scope, $rootScope, $stateParams, entity, Preferences, User) {
        $scope.preferences = entity;
        $scope.load = function (id) {
            Preferences.get({id: id}, function(result) {
                $scope.preferences = result;
            });
        };
        $rootScope.$on('21pointsApp:preferencesUpdate', function(event, result) {
            $scope.preferences = result;
        });
    });

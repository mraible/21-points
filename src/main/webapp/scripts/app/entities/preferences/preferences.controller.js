'use strict';

angular.module('21pointsApp')
    .controller('PreferencesController', function ($scope, Preferences, PreferencesSearch) {
        $scope.preferencess = [];
        $scope.loadAll = function() {
            Preferences.query(function(result) {
               $scope.preferencess = result;
            });
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Preferences.get({id: id}, function(result) {
                $scope.preferences = result;
                $('#deletePreferencesConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Preferences.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deletePreferencesConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            PreferencesSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.preferencess = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.preferences = {weekly_goal: null, weight_units: null, id: null};
        };
    });

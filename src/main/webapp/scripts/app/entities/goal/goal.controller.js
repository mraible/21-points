'use strict';

angular.module('21pointsApp')
    .controller('GoalController', function ($scope, Goal, GoalSearch) {
        $scope.goals = [];
        $scope.loadAll = function() {
            Goal.query(function(result) {
               $scope.goals = result;
            });
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Goal.get({id: id}, function(result) {
                $scope.goal = result;
                $('#deleteGoalConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Goal.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteGoalConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            GoalSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.goals = result;
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
            $scope.goal = {name: null, description: null, id: null};
        };
    });

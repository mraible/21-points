'use strict';

angular.module('21pointsApp')
    .controller('GoalDetailController', function ($scope, $rootScope, $stateParams, entity, Goal, User) {
        $scope.goal = entity;
        $scope.load = function (id) {
            Goal.get({id: id}, function(result) {
                $scope.goal = result;
            });
        };
        $rootScope.$on('21pointsApp:goalUpdate', function(event, result) {
            $scope.goal = result;
        });
    });

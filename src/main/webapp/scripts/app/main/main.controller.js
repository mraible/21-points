'use strict';

angular.module('21pointsApp')
    .controller('MainController', function ($scope, Principal, points, preferences) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $scope.pointsThisWeek = points;
        $scope.pointsPercentage = (points.count / 21) * 100;
        $scope.preferences = preferences;
    });

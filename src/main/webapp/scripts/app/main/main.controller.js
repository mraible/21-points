'use strict';

angular.module('21pointsApp')
    .controller('MainController', function ($scope, Principal, Points, Preferences) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        Points.thisWeek(function(data) {
            $scope.pointsThisWeek = data;
            $scope.pointsPercentage = (data.count / 21) * 100;
        });

        Preferences.user(function(data) {
            $scope.preferences = data;
        })
    });

'use strict';

angular.module('21pointsApp')
    .controller('MainController', function ($scope, Chart, Principal, points, preferences, bpReadings) {
        Principal.identity().then(function (account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $scope.pointsThisWeek = points;
        $scope.pointsPercentage = (points.points / 21) * 100;
        $scope.preferences = preferences;

        $scope.bpReadings = bpReadings;
        if (bpReadings.readings.length) {
            $scope.bpOptions = Chart.getBpChartConfig();
            $scope.bpOptions.title.text = bpReadings.period;
            $scope.systolics = [];
            $scope.diastolics = [];
            bpReadings.readings.forEach(function (item) {
                $scope.systolics.push({
                    x: new Date(item.timestamp),
                    y: item.systolic
                });
                $scope.diastolics.push({
                    x: new Date(item.timestamp),
                    y: item.diastolic
                });
            });

            $scope.bpData = [{
                values: $scope.systolics,
                key: 'Systolic'
            }, {
                values: $scope.diastolics,
                key: 'Diastolic'
            }];
        }
    });

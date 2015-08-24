'use strict';

angular.module('21pointsApp')
    .controller('MainController', function ($scope, Chart, Principal, points, preferences, bpReadings, weights) {
        Principal.identity().then(function (account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $scope.pointsThisWeek = points;
        $scope.pointsPercentage = (points.points / 21) * 100;
        $scope.preferences = preferences;

        $scope.bpReadings = bpReadings;
        if (bpReadings.readings.length) {
            $scope.bpOptions = angular.copy(Chart.getBpChartConfig());
            $scope.bpOptions.title.text = bpReadings.period;
            $scope.bpOptions.chart.yAxis.axisLabel = "Blood Pressure";
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
                key: 'Systolic',
                color: '#f44336'
            }, {
                values: $scope.diastolics,
                key: 'Diastolic',
                color: '#03a9f4'
            }];
        }

        $scope.weights = weights;
        if (weights.weighIns.length) {
            $scope.weightOptions = angular.copy(Chart.getBpChartConfig());
            $scope.weightOptions.title.text = weights.period;
            $scope.weightOptions.chart.yAxis.axisLabel = "Weight";
            var weightValues = [];
            weights.weighIns.forEach(function (item) {
                weightValues.push({
                    x: new Date(item.timestamp),
                    y: item.weight
                });
            });
            $scope.weightData = [{
                values: weightValues,
                key: 'Weight',
                color: '#ffeb3b',
                area: true
            }];
        }
    });

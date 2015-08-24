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
            var systolics, diastolics, upperValues, lowerValues;
            systolics = [];
            diastolics = [];
            upperValues = [];
            lowerValues = [];
            bpReadings.readings.forEach(function (item) {
                systolics.push({
                    x: new Date(item.timestamp),
                    y: item.systolic
                });
                diastolics.push({
                    x: new Date(item.timestamp),
                    y: item.diastolic
                });
                upperValues.push(item.systolic);
                lowerValues.push(item.diastolic);
            });
            $scope.bpData = [{
                values: systolics,
                key: 'Systolic',
                color: '#673ab7'
            }, {
                values: diastolics,
                key: 'Diastolic',
                color: '#03a9f4'
            }];
            // set y scale to be 10 more than max and min
            $scope.bpOptions.chart.yDomain = [Math.min.apply(Math, lowerValues) - 10, Math.max.apply(Math, upperValues) + 10]
        }

        $scope.weights = weights;
        if (weights.weighIns.length) {
            $scope.weightOptions = angular.copy(Chart.getBpChartConfig());
            $scope.weightOptions.title.text = weights.period;
            $scope.weightOptions.chart.yAxis.axisLabel = "Weight";
            var weightValues = [];
            var values = [];
            weights.weighIns.forEach(function (item) {
                weightValues.push({
                    x: new Date(item.timestamp),
                    y: item.weight
                });
                values.push(item.weight);
            });
            $scope.weightData = [{
                values: weightValues,
                key: 'Weight',
                color: '#ffeb3b',
                area: true
            }];
            // set y scale to be 10 more than max and min
            $scope.weightOptions.chart.yDomain = [Math.min.apply(Math, values) - 10, Math.max.apply(Math, values) + 10];
        }
    });

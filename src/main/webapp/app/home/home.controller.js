(function () {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', 'Chart', 'Principal', 'LoginService', 'Preferences', 'Points', 'BloodPressure', 'Weight'];

    function HomeController($scope, $state, Chart, Principal, LoginService, Preferences, Points, BloodPressure, Weight) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        $scope.$on('authenticationSuccess', function () {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function (account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
                if (vm.isAuthenticated()) {
                    Preferences.user(function (preferences) {
                        vm.preferences = preferences;

                        Points.thisWeek(function (points) {
                            vm.pointsThisWeek = points;
                            vm.pointsPercentage = (points.points / vm.preferences.weeklyGoal) * 100;
                        });
                    });

                    BloodPressure.last30Days(function (bpReadings) {
                        vm.bpReadings = bpReadings;
                        if (bpReadings.readings.length) {
                            vm.bpOptions = angular.copy(Chart.getBpChartConfig());
                            vm.bpOptions.title.text = bpReadings.period;
                            vm.bpOptions.chart.yAxis.axisLabel = "Blood Pressure";
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
                            vm.bpData = [{
                                values: systolics,
                                key: 'Systolic',
                                color: '#673ab7'
                            }, {
                                values: diastolics,
                                key: 'Diastolic',
                                color: '#03a9f4'
                            }];
                            // set y scale to be 10 more than max and min
                            vm.bpOptions.chart.yDomain = [Math.min.apply(Math, lowerValues) - 10, Math.max.apply(Math, upperValues) + 10]
                        }
                    });

                    Weight.last30Days(function (weights) {
                        vm.weights = weights;
                        if (weights.weighIns.length) {
                            vm.weightOptions = angular.copy(Chart.getBpChartConfig());
                            vm.weightOptions.title.text = weights.period;
                            vm.weightOptions.chart.yAxis.axisLabel = "Weight";
                            var weightValues = [];
                            var values = [];
                            weights.weighIns.forEach(function (item) {
                                weightValues.push({
                                    x: new Date(item.timestamp),
                                    y: item.weight
                                });
                                values.push(item.weight);
                            });
                            vm.weightData = [{
                                values: weightValues,
                                key: 'Weight',
                                color: '#ffeb3b',
                                area: true
                            }];
                            // set y scale to be 10 more than max and min
                            vm.weightOptions.chart.yDomain = [Math.min.apply(Math, values) - 10, Math.max.apply(Math, values) + 10];
                        }
                    });
                }
            });
        }

        function register() {
            $state.go('register');
        }
    }
})();

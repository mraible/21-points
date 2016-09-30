(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService', 'Points', '$state'];

    function HomeController ($scope, Principal, LoginService, Points, $state) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });

            Points.thisWeek(function(data) {
                vm.pointsThisWeek = data;
                vm.pointsPercentage = (data.points / 21) * 100;
            });

            /*Preferences.user(function(data) {
                vm.preferences = data;
            });

            BloodPressure.last30Days(function(bpReadings) {
                vm.bpReadings = bpReadings;
                if (bpReadings.readings.length) {
                    vm.bpOptions = angular.copy(Chart.getBpChartConfig());
                    vm.bpOptions.title.text = bpReadings.period;
                    vm.bpOptions.chart.yAxis.axisLabel = "Blood Pressure";
                    var systolics, diastolics;
                    systolics = [];
                    diastolics = [];
                    bpReadings.readings.forEach(function (item) {
                        systolics.push({
                            x: new Date(item.timestamp),
                            y: item.systolic
                        });
                        diastolics.push({
                            x: new Date(item.timestamp),
                            y: item.diastolic
                        });
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
                }
            });*/
        }
        function register () {
            $state.go('register');
        }
    }
})();

'use strict';

angular.module('21pointsApp')
    .controller('BloodPressureController', function ($scope, BloodPressure, BloodPressureSearch, ParseLinks) {
        $scope.bloodPressures = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            BloodPressure.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.bloodPressures.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.bloodPressures = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            BloodPressure.get({id: id}, function(result) {
                $scope.bloodPressure = result;
                $('#deleteBloodPressureConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            BloodPressure.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteBloodPressureConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            BloodPressureSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.bloodPressures = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.reset();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.bloodPressure = {timestamp: null, systolic: null, diastolic: null, id: null};
        };
    });

'use strict';

angular.module('21pointsApp')
    .controller('WeightController', function ($scope, Weight, WeightSearch, ParseLinks) {
        $scope.weights = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Weight.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.weights.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.weights = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Weight.get({id: id}, function(result) {
                $scope.weight = result;
                $('#deleteWeightConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Weight.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteWeightConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            WeightSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.weights = result;
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
            $scope.weight = {timestamp: null, weight: null, id: null};
        };
    });

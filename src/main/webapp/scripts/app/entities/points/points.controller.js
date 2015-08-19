'use strict';

angular.module('21pointsApp')
    .controller('PointsController', function ($scope, Points, PointsSearch, ParseLinks) {
        $scope.points = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Points.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.points.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.points = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Points.get({id: id}, function(result) {
                $scope.points = result;
                $('#deletePointsConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Points.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deletePointsConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            PointsSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.points = result;
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
            $scope.points = {date: null, exercise: null, meals: null, alcohol: null, notes: null, id: null};
        };
    });

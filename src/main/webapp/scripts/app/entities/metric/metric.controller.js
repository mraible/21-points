'use strict';

angular.module('21pointsApp')
    .controller('MetricController', function ($scope, Metric, Entry, Goal, MetricSearch, ParseLinks) {
        $scope.metrics = [];
        $scope.entrys = Entry.query();
        $scope.goals = Goal.query();
        $scope.page = 1;
        $scope.loadAll = function() {
            Metric.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.metrics = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.showUpdate = function (id) {
            Metric.get({id: id}, function(result) {
                $scope.metric = result;
                $('#saveMetricModal').modal('show');
            });
        };

        $scope.save = function () {
            if ($scope.metric.id != null) {
                Metric.update($scope.metric,
                    function () {
                        $scope.refresh();
                    });
            } else {
                Metric.save($scope.metric,
                    function () {
                        $scope.refresh();
                    });
            }
        };

        $scope.delete = function (id) {
            Metric.get({id: id}, function(result) {
                $scope.metric = result;
                $('#deleteMetricConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Metric.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteMetricConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            MetricSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.metrics = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $('#saveMetricModal').modal('hide');
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.metric = {name: null, amount: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });

'use strict';

angular.module('21pointsApp')
    .controller('EntryController', function ($scope, Entry, Goal, Metric, EntrySearch, ParseLinks) {
        $scope.entrys = [];
        $scope.goals = Goal.query();
        $scope.metrics = Metric.query();
        $scope.page = 1;
        $scope.loadAll = function() {
            Entry.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.entrys.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.entrys = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.showUpdate = function (id) {
            Entry.get({id: id}, function(result) {
                $scope.entry = result;
                $('#saveEntryModal').modal('show');
            });
        };

        $scope.save = function () {
            if ($scope.entry.id != null) {
                Entry.update($scope.entry,
                    function () {
                        $scope.refresh();
                    });
            } else {
                Entry.save($scope.entry,
                    function () {
                        $scope.refresh();
                    });
            }
        };

        $scope.delete = function (id) {
            Entry.get({id: id}, function(result) {
                $scope.entry = result;
                $('#deleteEntryConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Entry.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteEntryConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.search = function () {
            EntrySearch.query({query: $scope.searchQuery}, function(result) {
                $scope.entrys = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.reset();
            $('#saveEntryModal').modal('hide');
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.entry = {date: null, exercise: null, meals: null, alcohol: null, notes: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });

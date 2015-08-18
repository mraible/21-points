'use strict';

angular.module('21pointsApp')
    .controller('EntryDetailController', function ($scope, $stateParams, Entry, Goal, Metric) {
        $scope.entry = {};
        $scope.load = function (id) {
            Entry.get({id: id}, function(result) {
              $scope.entry = result;
            });
        };
        $scope.load($stateParams.id);
    });

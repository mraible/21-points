'use strict';

angular.module('21pointsApp')
    .controller('MetricDetailController', function ($scope, $stateParams, Metric, Entry, Goal) {
        $scope.metric = {};
        $scope.load = function (id) {
            Metric.get({id: id}, function(result) {
              $scope.metric = result;
            });
        };
        $scope.load($stateParams.id);
    });

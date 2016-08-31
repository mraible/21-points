(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('PreferencesDetailController', PreferencesDetailController);

    PreferencesDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Preferences', 'User'];

    function PreferencesDetailController($scope, $rootScope, $stateParams, previousState, entity, Preferences, User) {
        var vm = this;

        vm.preferences = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('21PointsApp:preferencesUpdate', function(event, result) {
            vm.preferences = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();

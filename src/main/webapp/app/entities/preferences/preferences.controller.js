(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('PreferencesController', PreferencesController);

    PreferencesController.$inject = ['$scope', '$state', 'Preferences', 'PreferencesSearch'];

    function PreferencesController ($scope, $state, Preferences, PreferencesSearch) {
        var vm = this;
        
        vm.preferences = [];
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Preferences.query(function(result) {
                vm.preferences = result;
            });
        }

        function search () {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            PreferencesSearch.query({query: vm.searchQuery}, function(result) {
                vm.preferences = result;
            });
        }    }
})();

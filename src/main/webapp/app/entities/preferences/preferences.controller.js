(function () {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('PreferencesController', PreferencesController);

    PreferencesController.$inject = ['$scope', '$state', 'Preferences', 'PreferencesSearch', 'Principal'];

    function PreferencesController($scope, $state, Preferences, PreferencesSearch, Principal) {
        var vm = this;

        vm.preferences = [];
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Preferences.query(function (result) {
                vm.preferences = result;
            });

            // get user account so we can inspect roles and determine hide/show of add button
            Principal.identity().then(function (account) {
                vm.isAdmin = account.authorities.indexOf('ROLE_ADMIN') !== -1;
            });
        }

        function search() {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            PreferencesSearch.query({query: vm.searchQuery}, function (result) {
                vm.preferences = result;
            });
        }
    }
})();

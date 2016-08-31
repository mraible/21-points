(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('PreferencesDeleteController',PreferencesDeleteController);

    PreferencesDeleteController.$inject = ['$uibModalInstance', 'entity', 'Preferences'];

    function PreferencesDeleteController($uibModalInstance, entity, Preferences) {
        var vm = this;

        vm.preferences = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Preferences.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();

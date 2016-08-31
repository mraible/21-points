(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('WeightDeleteController',WeightDeleteController);

    WeightDeleteController.$inject = ['$uibModalInstance', 'entity', 'Weight'];

    function WeightDeleteController($uibModalInstance, entity, Weight) {
        var vm = this;

        vm.weight = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Weight.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('PointsDeleteController',PointsDeleteController);

    PointsDeleteController.$inject = ['$uibModalInstance', 'entity', 'Points'];

    function PointsDeleteController($uibModalInstance, entity, Points) {
        var vm = this;

        vm.points = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;
        
        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Points.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();

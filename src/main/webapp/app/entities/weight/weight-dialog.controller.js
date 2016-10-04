(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('WeightDialogController', WeightDialogController);

    WeightDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Weight', 'User'];

    function WeightDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Weight, User) {
        var vm = this;

        // defaults for new entries
        if (!entity.id) {
            var now = new Date();
            entity.timestamp = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()));
        }

        vm.weight = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.users = User.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.weight.id !== null) {
                Weight.update(vm.weight, onSaveSuccess, onSaveError);
            } else {
                Weight.save(vm.weight, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('21PointsApp:weightUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.timestamp = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();

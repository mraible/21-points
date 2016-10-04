(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .controller('BloodPressureDialogController', BloodPressureDialogController);

    BloodPressureDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'BloodPressure', 'User'];

    function BloodPressureDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, BloodPressure, User) {
        var vm = this;

        // defaults for new entries
        if (!entity.id) {
            var now = new Date();
            entity.timestamp = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()));
        }

        vm.bloodPressure = entity;
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
            if (vm.bloodPressure.id !== null) {
                BloodPressure.update(vm.bloodPressure, onSaveSuccess, onSaveError);
            } else {
                BloodPressure.save(vm.bloodPressure, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('21PointsApp:bloodPressureUpdate', result);
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

(function() {
    'use strict';

    angular
        .module('21PointsApp')
        .config(bootstrapMaterialDesignConfig);

    bootstrapMaterialDesignConfig.$inject = [];

    function bootstrapMaterialDesignConfig() {
        $.material.init();
    }
})();

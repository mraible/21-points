 'use strict';

angular.module('21pointsApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-21pointsApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-21pointsApp-params')});
                }
                return response;
            },
        };
    });
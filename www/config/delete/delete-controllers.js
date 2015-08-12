(function (window, angular, console) {
    'use strict';
    angular.module('myApp.controllers').controller('config-delete', ['$scope', '$rootScope', '$http', '$stateParams', '$state',
        function ($scope, $rootScope, $http, $stateParams, $state) {
            $scope.delete = function () {
                $scope.error = null;
                $http.delete('/couchdb/'+$rootScope.appID+'/' + $scope.configuration._id + '?rev=' + $scope.configuration._rev).
                success(function (data, status, headers, config) {
                    $state.go('configurations.list', {
                        organization: $stateParams.organization,
                        configuration: $stateParams.configuration
                    });
                }).
                error(function (data, status, headers, config) {
                    $scope.error = data;
                });

            };
        }]);
})(this, this.angular, this.console);
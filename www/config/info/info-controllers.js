(function (window, angular, console) {
    'use strict';
    angular.module('myApp.controllers').controller('config-info', ['$scope', '$rootScope', '$http', '$stateParams',
        function ($scope, $rootScope, $http, $stateParams) {
            $scope.save = function () {
                $scope.success = null;
                $scope.error = null;
                try {
                    $scope.configuration.form = JSON.parse($scope.configuration.form);
                    $http.put('/couchdb/'+$rootScope.appID+'/' + $scope.configuration._id, $scope.configuration).
                    success(function (data, status, headers, config) {
                        $scope.success = data;
                        $scope.configuration._rev = data.rev;
                        $scope.changed = false;
                    }).
                    error(function (data, status, headers, config) {
                        $scope.error = data;
                    });
                } catch (ex) {
                    $scope.error = ex.message;

                }

            };
            
            
            $scope.$on("validate", function () {
                $scope.changed = true;
            });
        }]);
})(this, this.angular, this.console);
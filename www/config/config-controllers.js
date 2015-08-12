(function (window, angular, console) {
    'use strict';
    angular.module('myApp.controllers').controller('config', ['$scope', '$rootScope', '$http', '$stateParams', 'data',
        function ($scope, $rootScope, $http, $stateParams, data) {
            data.configuration.list = data.configuration.list || [];
            $scope.configuration = data.configuration;
            $scope.schema = data.schema;
            $http.get('/api/organization/' + $scope.configuration.organization + '/databases').
            success(function (data, status, headers, config) {
                for (var i = 0; i < data.rows.length; i++) {
                    var database = data.rows[i];
                    if (database.id === $scope.configuration.database) {
                        $scope.database = database;
                        break;
                    }
                }
            }).
            error(function (data, status, headers, config) {
                $scope.error = data;
            });


            $scope.save = function () {
                $scope.success = null;
                $scope.error = null;
                try {
                    //$scope.configuration.form = JSON.parse($scope.configuration.form);
                    $http.put('/couchdb/' + $rootScope.appID + '/' + $scope.configuration._id, $scope.configuration).
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



        }
    ]);
})(this, this.angular, this.console);
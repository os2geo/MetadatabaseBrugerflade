(function (window, angular, console) {
    'use strict';
    angular.module('myApp.controllers').controller('configurations-create', ['$scope', '$rootScope', '$http', '$stateParams', '$state',
        function ($scope, $rootScope, $http, $stateParams, $state) {
            $scope.error = null;
            $scope.submit = function (form) {
                $scope.success = null;
                $scope.error = null;
                if (form.$valid) {
                    $http.post('/couchdb/' + $rootScope.appID, {
                        organization: $stateParams.organization,
                        name: $scope.name,
                        database: $scope.database,
                        form: [],
                        list: [],
                        logo: "",
                        main: "",
                        footer: "",
                        type: 'configuration'
                    }).
                    success(function (data, status, headers, config) {
                        console.log(data);
                        $state.go('configurations.list', {
                            organization: $stateParams.organization
                        });
                    }).
                    error(function (data, status, headers, config) {
                        console.log(data);
                        $scope.error = data;
                    });
                } else {
                    //form.name.$pristine = false;
                }
            };
            $http.get('/api/organization/' + $stateParams.organization + '/databases').
            success(function (data, status, headers, config) {
                console.log(data);
                $scope.databases = data;
            }).
            error(function (data, status, headers, config) {
                $scope.error = data;
            });
        }
    ]);
})(this, this.angular, this.console);
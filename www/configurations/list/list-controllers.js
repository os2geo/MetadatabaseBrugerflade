(function (window, angular, console) {
    'use strict';
    angular.module('myApp.controllers').controller('configurations-list', ['$scope', '$rootScope', '$http', '$stateParams',
        function ($scope, $rootScope, $http, $stateParams) {
            $http.get('/couchdb/' + $rootScope.appID + '/_design/config/_view/configuration?include_docs=true&key="' + $stateParams.organization + '"').
            success(function (data, status, headers, config) {
                $scope.configurations = data.rows;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
        }
    ]);
})(this, this.angular, this.console);
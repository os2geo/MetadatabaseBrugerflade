(function (window, angular, console, tv4) {
    'use strict';
    angular.module('myApp.controllers').controller('config-text', ['$scope', '$http',
        function ($scope, $http) {

            $scope.tekst = angular.toJson($scope.$parent.configuration, true);
            $scope.$watch("tekst", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.textError = null;
                    try {
                        $scope.$parent.configuration = JSON.parse(newValue);
                        $scope.$emit('validate');
                    } catch (ex) {
                        $scope.textError = ex.message;
                        $scope.$parent.valid = null;
                    }
                }
            });
        }
    ]);
})(this, this.angular, this.console, this.tv4);
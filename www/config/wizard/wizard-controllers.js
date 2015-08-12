(function (window, angular, console, FileReader, Image) {
    'use strict';
    angular.module('myApp.controllers').controller('config-wizard', ['$scope', '$rootScope', '$upload', '$http',
        function ($scope, $rootScope, $upload, $http) {
            $scope.schemakeys = [];
            var buildKeys = function (node, parent) {
                for (var key in node) {
                    if (node[key].properties) {

                        buildKeys(node[key].properties, parent + '/' + key);

                    } else {
                        $scope.schemakeys.push(parent + '/' + key);
                    }
                }
            };
            buildKeys($scope.schema.properties, "");
            $scope.formkeys = [];
            if ($scope.schema.properties) {
                for (var key in $scope.schema.properties) {
                    $scope.formkeys.push(key);
                }
            }
            for (var i = 0; i < $scope.configuration.list.length; i++) {
                var id = $scope.configuration.list[i];
                var index = $scope.schemakeys.indexOf(id);
                if (index !== -1) {
                    $scope.schemakeys.splice(index, 1);
                }
            }


            var checkStringType = function (string) {
                switch (string.format) {
                case "date-time":
                    return "text";
                case "email":
                    return "email";
                case "hostname":
                    return "url";
                case "ipv4":
                    return "url";
                case "ipv6":
                    return "url";
                case "uri":
                    return "url";
                }
                return "text";
            };
            var checkType = function (item) {
                if (item.enum && item.enum.length > 1) {
                    return "select";
                } else {
                    if (angular.isArray(item.type)) {
                        if (item.type.indexOf('string') !== -1) {
                            return checkStringType(item);
                        } else if (item.type.indexOf('object') !== -1) {
                            return "group";
                        } else if (item.type.indexOf('boolean') !== -1) {
                            return "checkbox";
                        } else if (item.type.indexOf('array') !== -1) {
                            return "checkbox";
                        }
                    } else {
                        switch (item.type) {
                        case "string":
                            return checkStringType(item);
                        case "object":
                            return "group";
                        case "boolean":
                            return "checkbox";
                        case "array":
                            return "checkbox";
                        }
                    }
                }
                return "";
            };


            for (var j = 0; j < $scope.configuration.form.length; j++) {
                var formid = $scope.configuration.form[j].id;
                var indexform = $scope.formkeys.indexOf(formid);
                if (indexform !== -1) {
                    $scope.formkeys.splice(indexform, 1);
                }
            }

            $scope.addListField = function () {
                $scope.configuration.list.push($scope.schemafield);
                var i = $scope.schemakeys.indexOf($scope.schemafield);
                $scope.schemakeys.splice(i, 1);
                $scope.schemafield = null;
                $scope.$emit('validate');
            };
            $scope.removeListField = function () {
                $scope.schemakeys.push($scope.configuration.list[this.$index]);
                $scope.configuration.list.splice(this.$index, 1);
                $scope.$emit('validate');
            };
            $scope.addFormField = function () {
                var field = {
                    id: $scope.formfield,
                    fields: []
                };
                var item = $scope.schema.properties[$scope.formfield];
                field.type = checkType(item);
                $scope.configuration.form.push(field);
                var i = $scope.formkeys.indexOf($scope.formfield);
                $scope.formkeys.splice(i, 1);
                $scope.formfield = null;
                $scope.$emit('validate');
            };

        }
    ]);
})(this, this.angular, this.console, this.FileReader, this.Image);
(function (window, angular, console) {
    'use strict';

    // Declare app level module which depends on filters, and services
    angular.module('myApp', [
        'ui.router',
        'ui.bootstrap',
        'ui.sortable',
        'myApp.services',
        'myApp.controllers',
        'myApp.directives',
        'ncy-angular-breadcrumb',
        'angularFileUpload'
    ])

    .config(['$stateProvider', '$urlRouterProvider', '$breadcrumbProvider',
        function ($stateProvider, $urlRouterProvider, $breadcrumbProvider) {
            /*$breadcrumbProvider.setOptions({
                template: '<ol class="breadcrumb">' +
                    '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
                    '<a ng-switch-when="false" href="#{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a> ' +
                    '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
                    '</li>' +
                    '</ol>'
            });*/

            $urlRouterProvider.when('/:organization', '/:organization/list');
            $urlRouterProvider.when('/:organization/configuration/:configuration', '/:organization/configuration/:configuration/wizard');

            //$urlRouterProvider.otherwise("/:organization/configurations/list");
            
            $stateProvider.state('config', {
                url: '/:organization/configuration/:configuration',
                templateUrl: 'config/config.html',
                controller: 'config',
                data: {
                    ncyBreadcrumbLabel: '{{configuration.name}}',
                    ncyBreadcrumbParent: 'configurations'
                },
                resolve: {
                    data: function ($q, $http, $stateParams, $rootScope) {
                        var deferred = $q.defer();
                        $http.get('/couchdb/' + $rootScope.appID + '/' + $stateParams.configuration).
                        success(function (configuration, status, headers, config) {
                            $http.get('/couchdb/db-' + configuration.database + '/_design/schema').
                            success(function (schema, status, headers, config) {
                                deferred.resolve({
                                    configuration: configuration,
                                    schema: schema.schema
                                });
                            }).
                            error(function (data, status, headers, config) {
                                deferred.reject(data);
                            });
                        }).
                        error(function (data, status, headers, config) {
                            deferred.reject(data);
                        });
                        return deferred.promise;
                    }
                }
            });
            $stateProvider.state('config.wizard', {
                url: '/wizard',
                templateUrl: 'config/wizard/wizard.html',
                controller: 'config-wizard',
                data: {
                    ncyBreadcrumbLabel: 'Wizard',
                }
            });
            $stateProvider.state('config.text', {
                url: '/text',
                templateUrl: 'config/text/text.html',
                controller: 'config-text',
                data: {
                    ncyBreadcrumbLabel: 'Tekst',
                }
            });
            $stateProvider.state('config.delete', {
                url: '/delete',
                templateUrl: 'config/delete/delete.html',
                controller: 'config-delete',
                data: {
                    ncyBreadcrumbLabel: 'Slet',
                }
            });
            $stateProvider.state('configurations', {
                url: '/:organization',
                templateUrl: 'configurations/configurations.html',
                controller: 'configurations',
                data: {
                    ncyBreadcrumbLabel: 'Konfigurationer',
                }
            });

            $stateProvider.state('configurations.list', {
                url: '/list',
                templateUrl: 'configurations/list/list.html',
                controller: 'configurations-list',
                data: {
                    ncyBreadcrumbLabel: 'Liste',
                }
            });

            $stateProvider.state('configurations.create', {
                url: '/create',
                templateUrl: 'configurations/create/create.html',
                controller: 'configurations-create',
                data: {
                    ncyBreadcrumbLabel: 'Opret',
                }
            });

            $stateProvider.state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'login'
            });
        }
    ])

    .run(['$rootScope', '$stateParams', '$state', '$location', '$templateCache',
        function ($rootScope, $stateParams, $state, $location, $templateCache) {

            $templateCache.put("template/accordion/accordion-group.html",
                "<div class=\"panel panel-default\">\n" +
                "  <div class=\"panel-heading\">\n" +
                "    <h4 class=\"panel-title\">\n" +
                "      <a style=\"color:inherit\" class=\"pull-right\" ng-click=\"$broadcast('remove')\"><i class=\"fa fa-close\"></i></a>" +
                "      <a class=\"accordion-toggle\" ng-click=\"toggleOpen()\" ><i class=\"fa\" ng-class=\"{'fa-minus-square-o':isOpen,'fa-plus-square-o':!isOpen}\"></i></a>\n" +
                "      <span ng-class=\"{'text-muted': isDisabled}\" accordion-transclude=\"heading\">{{heading}}</span>" +
                "    </h4>\n" +
                "  </div>\n" +
                "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
                "	  <div class=\"panel-body\" ng-transclude></div>\n" +
                "  </div>\n" +
                "</div>");


            var urls = $location.$$absUrl.split('/');
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                if (url.indexOf('app-') !== -1) {
                    $rootScope.appID = url;
                    break;
                }
            }
            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    $state.go('login');
                });
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                if (toState.name !== 'login') {
                    $rootScope.lastState = toState.name;
                }
            });
        }
    ]);
})(this, this.angular, this.console);
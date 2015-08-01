'use strict';

angular.module('protobufDoc', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'smart-table'
])
.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/doc.html',
        controller: 'DocCtrl',
        resolve: {
            data: [function() {
                return JSON.parse('{%data%}')
            }]
        }
    })
    .otherwise({
        redirectTo: '/'
    });
})
.factory('_', ['$window', function($window) {
    var _ = $window._;
    delete $window._;
    return _;
}])
.controller('DocCtrl', ['$scope', 'data', '_', function($scope, data, _) {
    console.log(data);
    $scope.packages = _.map(data, function(item) {
        return {
            name: item.package,
            messages: item.messages
        };
    });
}]);

'use strict';
/**
 * @ngdoc overview
 * @name shareholderApp
 * @description
 * # shareholderApp
 * D3 Service loading D3 core and allowing injection as dependency.
 * @see Write up on the approach here: 
 * {@link http://www.ng-newsletter.com/posts/d3-on-angular.html}
 * Main module of the application.
 */
var myApp = angular.module('myApp', ['ngAnimate', 'ngRoute']);
myApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'appContentController',
            controllerAs: 'main'
        })
        .otherwise({
            redirectTo: '/'
        });
    // $locationProvider.html5Mode(false);
});
myApp.factory('d3Service', d3Service);
d3Service.$inject = ['$document', '$q', '$rootScope'];

function d3Service($document, $q, $rootScope) {
    var d3Service = {};
    /**
     * @function d3Service.d3
     * @description
     * Handles promise resolution for loading d3 library. 
     * We can then attach operations to that promise that rely on
     * d3 being available i.e.: d3Service.loaded().then(function(d3) { do some stuff... });
     */
    d3Service.loaded = function() {
        return d3Service.d3Promise.promise;
    };
    /**
     * @function d3Service.resolvePromise
     * @description
     * Callback for resolving the d3 promise once the script has loaded
     */
    d3Service.resolvePromise = function() {
        $rootScope.$apply(function() {
            d3Service.d3Promise.resolve(window.d3);
        });
    };
    /**
     * @function d3Service.appendD3
     * @description
     * Appends D3 script tag to the application when needed and listens for it to finish loading.
     */
    d3Service.appendD3 = function() {
        d3Service.d3Promise = $q.defer();
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js';
        scriptTag.onreadystatechange = function() {
            if (this.readyState === 'complete')
                d3Service.resolvePromise();
        };
        scriptTag.onload = d3Service.resolvePromise;
        var body = $document[0].getElementsByTagName('body')[0];
        body.appendChild(scriptTag);
    };
    // Trigger the append.
    d3Service.appendD3();
    return d3Service;
}
(function (angular, cordova) {
    'use strict';

    angular.module('app', ['ionic','templates', 'angulartics', 'angulartics.google.analytics.cordova'])

    .run(['$ionicPlatform', 'Debug', function($ionicPlatform, Debug) {
        $ionicPlatform.ready(function() {
            // Configure Cordova Plugins
            if (window.cordova) {
                if (window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    window.StatusBar.styleLightContent();
                }
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                }
            }
        });
        Debug.init();
    }])

    .config(['$stateProvider', '$urlRouterProvider', '$analyticsProvider', 'googleAnalyticsCordovaProvider', function($stateProvider, $urlRouterProvider, $analyticsProvider, googleAnalyticsCordovaProvider) {
        // Configure Google Analytics
        googleAnalyticsCordovaProvider.trackingId = 'UA-32340624-7';
        $analyticsProvider.firstPageview(true);

        $stateProvider
        .state('loader', {
            url: '/',
            templateUrl: 'loader/loader.html',
            controller: 'LoaderCtrl'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
        // Default to loading screen
        $urlRouterProvider.otherwise('/');
    }]);

})(window.angular, window.cordova);

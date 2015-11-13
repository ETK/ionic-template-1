(function (angular, cordova) {
    'use strict';

    angular.module('app', ['ionic','templates'])

    .run(['$ionicPlatform', 'Debug', function($ionicPlatform, Debug) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                window.StatusBar.styleDefault();
            }
            if (navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
        });
        Debug.init();
    }])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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

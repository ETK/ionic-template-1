(function (angular) {
    'use strict';

    angular.module('app')

    .controller('LoaderCtrl', ['$cordovaContentSync', '$ionicPlatform', '$state', '$ionicHistory', '$imageCacheFactory', function ($cordovaContentSync, $ionicPlatform, $state, $ionicHistory, $imageCacheFactory) {
        $ionicPlatform.ready(function() {
            $cordovaContentSync.sync()
            .then(function(syncSuccess) {
                // Update was successful!
                console.log('ContentSync successful', syncSuccess);
            }, function(syncError) {
                // Problem syncing or no new update available
                console.log('ContentSync unsuccessful', syncError);
            }, function(syncNotify) {
                // Sync progress
                console.log('ContentSync progress', syncNotify);
            })
            .finally(function() {
                // Cache any images which may be required on the first view
                $imageCacheFactory.cache([
                    'http://placehold.it/40x40'
                ])
                .finally(function() {
                    // Make the next view the bottom of the history stack
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    $state.go('home');
                });
            });
        });
    }]);

})(window.angular);

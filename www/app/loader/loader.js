(function (angular) {
    'use strict';

    angular.module('app')

    .controller('LoaderCtrl', ['CordovaContentSync', '$ionicPlatform', '$state', '$ionicHistory', function (CordovaContentSync, $ionicPlatform, $state, $ionicHistory) {
        $ionicPlatform.ready(function() {
            CordovaContentSync.sync()
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
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('home');
            });
        });
    }]);

})(window.angular);

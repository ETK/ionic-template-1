(function (angular) {
    'use strict';

    angular.module('app')

    .factory('Config', ['$ionicPlatform', '$q', function ($ionicPlatform, $q) {
        var config = {
            appIdentifier: null,
            appVersion: null
        };

        var init = function() {
            var deferred = $q.defer();
            if (window.cordova) {
                window.cordova.getAppVersion.getPackageName()
                .then(function(packageName) {
                    config.appIdentifier = packageName;
                    window.cordova.getAppVersion.getVersionNumber()
                    .then(function(versionNumber) {
                        config.appVersion = versionNumber;
                        deferred.resolve(config);
                    });
                });
            } else {
                deferred.reject('CONFIG_UNAVAILABLE');
            }
            return deferred.promise;
        };

        return {
            init: init
        };
    }]);

})(window.angular);

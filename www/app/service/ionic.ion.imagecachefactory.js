(function (angular) {
    'use strict';

    angular.module('ionic.ion.imageCacheFactory', [])

    .factory('$imageCacheFactory', ['$q', function($q) {
        return {
            cache: function(urls) {
                if (!(urls instanceof Array)) {
                    return $q.reject('Input is not an array');
                }
                var promises = [];
                for (var i = 0; i < urls.length; i++) {
                    var deferred = $q.defer();
                    var img = new Image();
                    /* jshint ignore:start */
                    img.onload = (function(deferred) {
                        return function() {
                            deferred.resolve();
                        };
                    })(deferred);
                    img.onerror = (function(deferred, url) {
                        return function() {
                            deferred.reject(url);
                        };
                    })(deferred,urls[i]);
                    /* jshint ignore:end */
                    promises.push(deferred.promise);
                    img.src = urls[i];
                }
                return $q.all(promises);
            }
        };
    }]);

})(window.angular);

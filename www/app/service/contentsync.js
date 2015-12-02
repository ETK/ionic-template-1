(function (angular) {
    'use strict';

    angular.module('app')

    .provider('$cordovaContentSync',[function () {
        var manifestLocation = '';
        this.setManifestLocation = function(url) {
            manifestLocation = url;
        };

        var CordovaContentSync = ['$q', '$http', 'Config', function ($q, $http, Config) {
            var init = function() {
                var deferred = $q.defer();
                if (manifestLocation !== '') {
                    if (getCurrentCodeRevision() === 0) {
                        Config.init()
                        .then(function(config) {
                            getUpdateFromManifest(config)
                            .then(function(update) {
                                sync(update)
                                .then(function(updateSuccess) {
                                    localStorage.setItem('currentUpdate', JSON.stringify(updateSuccess));
                                }, function(updateError) {
                                    console.log(updateError);
                                }, function(updateProgress) {
                                    deferred.notify(updateProgress);
                                })
                                .finally(function() {
                                    loadCurrentCodeRevision()
                                    .then(function() {
                                        // If the load was successful, this will never get called!
                                        // Should resolve to UPDATE_RUNNING after the page load
                                    }, function(loadError) {
                                        deferred.reject(loadError);
                                    });
                                });
                            }, function(manifestError) {
                                console.log(manifestError);
                                loadCurrentCodeRevision()
                                .then(function() {
                                    // If the load was successful, this will never get called!
                                    // Should resolve to UPDATE_RUNNING after the page load
                                }, function(loadError) {
                                    deferred.reject(loadError);
                                });
                            });
                        }, function(configError) {
                            deferred.reject(configError);
                        });
                    } else {
                        deferred.resolve('UPDATE_RUNNING');
                    }
                } else {
                    deferred.reject('NO_MANIFEST_LOCATION');
                }
                return deferred.promise;
            };

            // Helper function which return the currently running code revision
            var getCurrentCodeRevision = function() {
                var url = window.location.href.split('/');
                for (var i = 0; i < url.length; i++) {
                    if (url[i].indexOf('revision') > -1) {
                        return parseInt(url[i].split('-')[1]);
                    }
                }
                return 0;
            };

            // Returns compatible update
            var getUpdateFromManifest = function(config) {
                var httpDeferred = $q.defer();
                var currentUpdate = JSON.parse(localStorage.getItem('currentUpdate'));
                var currentRevision = currentUpdate ? currentUpdate.codeRevision : 0;

                $http({
                    url: manifestLocation,
                    cache: false,
                    timeout: 15000
                })
                .then(function(manifestSuccess) {
                    var manifest = manifestSuccess.data[config.appIdentifier];
                    if (manifest) {
                        for (var i = 0; i < manifest.length; i++) {
                            var remoteUpdate = manifest[i];
                            if (remoteUpdate.buildVersion === config.appVersion && parseInt(remoteUpdate.codeRevision) > currentRevision) {
                                httpDeferred.resolve(remoteUpdate);
                            }
                        }
                        httpDeferred.reject('NO_REMOTE_UPDATE_AVAILABLE');
                    } else {
                        httpDeferred.reject('APP_IDENTIFIER_NOT_IN_MANIFEST');
                    }
                }, function() {
                    httpDeferred.reject('MANIFEST_UNREACHABLE');
                });
                return httpDeferred.promise;
            };

            // Downloads update
            var sync = function(update) {
                var syncDeferred = $q.defer();
                console.log('Downloading update', update);
                if (window.cordova) {
                    var sync = window.ContentSync.sync({
                        src: update.zipLocation,
                        id: 'revision-' + update.codeRevision,
                        type: 'merge',
                        copyRootApp: true,
                        timeout: 60000
                    });

                    sync.on('progress', function(data) {
                        syncDeferred.notify(data);
                    });

                    sync.on('complete', function(data) {
                        console.log('complete', data);
                        syncDeferred.resolve(update);
                    });

                    sync.on('error', function(e) {
                        syncDeferred.reject('SYNC_' + window.ContentSync.ERROR_STATE[e]);
                    });

                    sync.on('cancel', function() {
                        syncDeferred.reject('SYNC_CANCELLED');
                    });
                } else {
                    syncDeferred.reject('NO_CORDOVA');
                }
                return syncDeferred.promise;
            };

            // Loads the currently downloaded update
            var loadCurrentCodeRevision = function() {
                var loadDeferred = $q.defer();
                Config.init()
                .then(function(config) {
                    var update = JSON.parse(localStorage.getItem('currentUpdate'));
                    if (update) {
                        if (update.buildVersion === config.appVersion) {
                            // TODO: Delete the old codebases as they are no longer necessary
                            var sync = window.ContentSync.sync({
                                id: 'revision-' + update.codeRevision,
                                type: 'local'
                            });

                            sync.on('complete', function(localUpdate) {
                                console.log('localUpdate complete', localUpdate);
                                window.location.href = 'file://' + localUpdate.localPath + '/index.html';
                            });

                            sync.on('error', function(localError) {
                                console.log('localUpdate error', localError);
                                // Cannot find downloaded revision, start again!
                                localStorage.removeItem('currentUpdate');
                                loadDeferred.reject('NO_LOCAL_UPDATE_FILES');
                            });
                        } else {
                            // TODO: Delete the old codebases as they are no longer necessary
                            localStorage.removeItem('currentUpdate');
                            loadDeferred.reject('UPDATE_INCOMPATIBLE');
                        }
                    } else {
                        loadDeferred.reject('NO_LOCAL_UPDATE_AVAILABLE');
                    }
                }, function(configError) {
                    loadDeferred.reject(configError);
                });
                return loadDeferred.promise;
            };

            return {
                sync: init
            };
        }];

        return {
            $get: ['$injector', function ($injector) {
                return $injector.instantiate(CordovaContentSync);
            }],
            setManifestLocation: this.setManifestLocation
        };
    }]);

})(window.angular);

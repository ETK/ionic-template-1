(function (angular) {
    'use strict';

    angular.module('app')

    .factory('Debug', ['$http', function($http) {
        return {
            init: function() {
                window.WeinreServerURL = 'http://debug.elixel.co.uk';
                $http({
                    url: 'http://debug.elixel.co.uk/target/target-script-min.js',
                    method: 'GET',
                    headers: {
                        Authorization: 'Basic ZWxpeGVsOkVsMXgzbDEx'
                    }
                })
                .then(function(success) {
                    var script = document.createElement('script');
                    script.text = success.data;
                    script.type = 'text/javascript';
                    document.body.appendChild(script);
                });
            }
        };
    }]);

})(window.angular);

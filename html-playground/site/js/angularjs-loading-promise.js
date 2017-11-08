(function () {
    'use strict';

    angular
        .module('angularjs', [])
        .directive('busy',['$compile',
            function($compile){

                return {
                    restrict: 'A',
                    link: function(scope, element, attrs, fn) {

                        var templateElement;
                        var templateScope = scope.$new();

                        var finished = false;

                        var busy = scope.$eval(attrs.busy);

                        //console.log(busy);

                        busy.promise.then(function () {
                            finished = true;
                            //console.log('promises finished');
                        });

                        templateScope.$isActive = function() {
                            var isActive = !finished;
                            //console.log('isActive', isActive);
                            return isActive;
                        };
                        templateScope.$message = busy.message;

                        templateElement = $compile("<div class=\"busy\" ng-show=\"$isActive()\"><div class=\"busy-message\" ng-show=\"$message\" >{{$message}}</div></div>")(templateScope);

                        element.append(templateElement);

                        scope.$watch(attrs.busy, function (newVal, oldVal, scope) {
                            //console.log(newVal, oldVal);
                            templateScope.$message = newVal.message;
                        }, true);

                    }
                };
            }
        ])
        .controller('ExampleController', ['$q', '$timeout', function ($q, $timeout) {
            var controller = this;
            var deferred = $q.defer();

            controller.progressMessage = "loading...";
            controller.progressPromise = deferred.promise;

            var counter = 0;
            var tick = function () {
                $timeout(function () {
                    counter ++;
                    var message = counter + "/10 ...";
                    //console.log('tick', message);
                    controller.progressMessage = message;
                    if (counter === 10) {
                        deferred.resolve({});
                    } else {
                        tick();
                    }
                },1000);
            };

            tick();


        }]);


})();
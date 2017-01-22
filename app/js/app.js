
var app=angular.module("app", ['ngRoute']);

app.controller("ctrl", function($scope, $route, $routeParams, $location) {
  $scope.scopedata="hello world from controller";


  // for debugging on index.html
  $scope.$route=$route;
  $scope.$routeParams=$routeParams;
  $scope.$location=$location;
});


app.controller("BookController",function($scope, $routeParams) {
    $scope.name="Book Controller";
    $scope.params=$routeParams;
});



app.controller("SlowController", function($scope) {
    console.log("Scope = ",$scope);
    // to make things fun, the $resolve isn't added to scope until after the controller method fires..
    // so the log below will always log undefined..
    // but if put in a timeout to run a bit later, will have a value.
    console.log("Scope.$resolve = ",$scope.$resolve);


});


app.config(function($routeProvider, $locationProvider) {
    /*
          <!-- lots of issues here, depending on whether or not you are using html5 mode..
          <sigh>
                if you have html5 mode enabled... then the # will not who up in the url (you get some push state crap).
                so imagine old school would have looked like  http://site:8080/#Book/something
                in html 5 land you have                       http://site:8080/Book/something

                if the users refreshes the page, the server looks for Book unless you have some rewriting rules turned on.
                instead of index.html#Book:(

                so to make it work for everyone, you can disable html5 and put the bang back.
                angular 1.6 changes # to #!... and that seem to also break in weird ways.
                $locationProvider.hashPrefix('');  will remove the '!'

                so to make things work, I had to turn off html, and change the rewrite prefix to '' (from '!').

                plus... add the # to every URL.  I think it might be better to use the onclick and "$location.goto" intead of a link.
                that might make things work better. 
          -->

     */
    $locationProvider.hashPrefix('');
    //$locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            template: "<b> you are at slash </b>"
        })
        .when('/Slow', {
            template: "<h5>... worked a long time to figure out that the answer is {{$resolve.slowValue}} and the easy answer was {{$resolve.fastValue}}.</h5>",
            controller: "SlowController",
            resolve: {
                // I will cause a 1 second delay
                slowValue: function($q, $timeout) {
                    var delay = $q.defer();
                    $timeout(function() {console.log("calling resolve..");delay.resolve("3.14159");}, 3000);
                    return delay.promise;
                },
                fastValue: function() {return "-1";}
            }

        })
        .when('/Book/:bookId', {
            controller:'BookController',
            templateUrl: "book.html"
        })
        .when('/Book/:bookId/ch/:chapterId?', {
            controller:'BookController',
            templateUrl: "book.html"
        });

});



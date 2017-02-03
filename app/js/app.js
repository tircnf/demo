
var app=angular.module("app", ['ui.router']);


app.service('SpinnerService', function($rootScope) {
    var count=0;

    var showSpinner=function() {
        console.log("Spinning... busy");
    };

    var hideSpinner=function() {
        console.log("Done.. no longer busy");
    };

    var service= {
        busy: function() {  return count>0?"BUSY":"";},
        transitionStart: function() {if (++count>0) {showSpinner();}},
        transitionEnd: function() {if (--count<=0) {hideSpinner();}}
    };

    // documentation is missing stateChangeCancel

    $rootScope.$on('$stateChangeStart', function() {
        service.transitionStart();
    });

    $rootScope.$on('$stateChangeSuccess',function() {
        service.transitionEnd();
    });

    $rootScope.$on('$stateChangeError',function() {
        service.transitionEnd();
    });

    // this event was added sept 2016, and is not documented yet.
    $rootScope.$on('$stateChangeCancel',function() {
        service.transitionEnd();
    });

    return service;
});


app.controller("ctrl", function($scope, $rootScope, SpinnerService) {
  $scope.scopedata="hello world from controller";

  $scope.busy=SpinnerService.busy;

  var eventListener=function (event, toState, toParams, fromState, fromParams, options) {
        console.log("Event = ",event);
        console.log("toState = ",toState);
        console.log("toParams = ",toParams);
        console.log("fromState = ",fromState);
        console.log("fromParams = ",fromParams);
        console.log("options = ",options);

        console.log("\n\n");
  };

  var unfoundState=function(event, unfoundState, fromState, fromParams) {
        console.log("Event = ",event);
        console.log("unfoundState = ",unfoundState);
        console.log("fromState = ",fromState);
        console.log("fromParams = ",fromParams);
        console.log("\n\n");
  };

  // stateChangeEvents are deprecated and disabled by transition Hooks as of version 1.0.
  // we are using 0.4.2 for now
  //
  $rootScope.$on('$stateChangeStart', eventListener);   // can use event.preventDefault() to stop transition.
  $rootScope.$on('$stateChangeSuccess', eventListener); //
  $rootScope.$on('$stateChangeError', eventListener);  // different.. no options
  $rootScope.$on('$stateNotFound', unfoundState);
  $rootScope.$on('$stateChangeCancel', eventListener);

});


app.config(function($stateProvider, $urlRouterProvider ) {

    var indexState={
        name: 'index',
        url: '/',
        template: 'Boring Index file.  Try clicking <a ui-sref="hello">hello</a> or <a ui-sref="books.book({bookId:1})">The Princess Bride</a>'
    };

    var helloState= {
        name: 'hello',
        url:  '/hello',
        template: '<h3> hello world </h3>'
    };

    var booksState = {
        name: 'books',
        url:  '/books',
        controller: function($scope, books) {
            // check out the page on angular components (template/controller/bindings)
            // you can create a bindings: {books: '<'} in your component, and the books
            // variable will get added directly to your controller (mix with controller as syntax)
            // to get $ctl.books
            
            $scope.books=books;
        },
        templateUrl: "books.html",
        resolve: {
            books: function() {
                // move to a function.. inject bookService.
                var bookList=[
                        {title: "Moby Dick", text: "blah blah moby dick.. big fist, etc"},
                        {title: "The Princess Bride", text: "As you wish... blah blah blah... big giant"},
                        {title: "Dune", text: "Lots of Sand... little mouse.. "}];
                return bookList;

            }
        }
    };

    var counter=0;
    var bookState = {
        name: 'books.book',
        url: '/{bookId}',
        templateUrl: "book.html",
        controller: function($scope, book, $stateParams) {
            // like previous comment.. have to manually add stuff from the
            // resolve block to the scope.
            $scope.book=book;
            $scope.bookId=$stateParams.bookId;
        },
        resolve: {
            book:   function(books, $stateParams,$q, $timeout) {
                counter++;
                var defer=$q.defer();
                // pretend there is a .5 second delay to fetch the book information.
                // this looks okay when you navigation from books to books/{bookId}
                // but if you refresh the page, nothing displays until the full child is
                // resolved.
                // this might "look" better... if the book list were to come up
                // with its "instant" resolve, and then wait for the book to come up.
                // but I don't think you can use this resolve code to do that. :(
                // and will have to manually resolve.
                // I guess that's for next weekend.
                $timeout(function() {
                    if (counter%2) {
                        defer.resolve(books[$stateParams.bookId]);
                    } else {
                        defer.resolve(books[$stateParams.bookId]);
                        //defer.reject("rejected..");
                    }
                },1500);

                return defer.promise;
            }
        }
    };


    $stateProvider.state(indexState);
    $stateProvider.state(helloState);
    $stateProvider.state(booksState);
    $stateProvider.state(bookState);

    $urlRouterProvider.otherwise("/");

});



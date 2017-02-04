
var app=angular.module("app", ['ui.router']);


// this service just knows if the system is busy changing state.
// It should only really ever be busy if a resolve block is waiting for data.
//
app.service('SpinnerService', function($rootScope) {
    var count=0;

    var service= {
        busy: function() {return count>0;},
        transitionStart: function() {++count;},
        transitionEnd: function() {--count;}
    };


    // documentation is missing stateChangeCancel

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        //console.log("Event = ",event);
        service.transitionStart();
    });

    $rootScope.$on('$stateChangeSuccess',function (event, toState, toParams, fromState, fromParams, options) {
        //console.log("Event = ",event);
        service.transitionEnd();
    });

    $rootScope.$on('$stateChangeError',function (event, toState, toParams, fromState, fromParams, options) {
        //console.log("Event = ",event);
        service.transitionEnd();
    });

    // this event was added sept 2016, and is not documented yet.
    $rootScope.$on('$stateChangeCancel',function (event, toState, toParams, fromState, fromParams, options) {
        //console.log("Event = ",event);
        service.transitionEnd();
    });

    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
        console.log("Event = ",event);
        console.log("unfoundState = ",unfoundState);
        console.log("fromState = ",fromState);
        console.log("fromParams = ",fromParams);
        console.log("\n\n");
    });

    return service;
});


app.controller("ctrl", function($scope, $rootScope, SpinnerService) {
  $scope.scopedata="hello world from controller";

  $scope.busy=SpinnerService.busy;

});

app.service('BookService', function($http) {

    var service={};

    // cached bookList.
    var bookList=[];

    var getBookList=function() {


        // if we have already resolved the bookList, just return it.
        // this code uses "loading" to determine if it is being fetched, or has been fetched.
        // if this variable doesn't exist, we need to go grab it.
        if (bookList.loading!==undefined) {
            return bookList;
        }

        var promise=$http.get("/api/books").then(function success(response) {
            // response has {data:.., status:<number>, headers: <function(headerName)>, config: <object>, statusText: http status text}
            angular.extend(bookList, response.data);
            bookList.loading=false;
        }, function err() {
            console.error("Error... ",arguments);
            bookList.promise=undefined;
            bookList.loading=undefined;
        });

        bookList.promise=promise;
        bookList.loading=true;

        return bookList;
    };

    var refreshList=function() {
        bookList.length=0;
        bookList.promise=undefined;
        bookList.loading=undefined;
        getBookList();
    };

    var getBook=function(id) {

        var book={id:id};

        var promise=$http.get("/api/books/"+id).then(function success(response) {
            angular.extend(book, response.data);
            book.loading=false;
        }, function err() {
            console.error("Error... ",arguments);
            book.loading=undefined;
            book.promise=undefined;
        });

        book.promise=promise;
        book.loading=true;

        return book;
    };


    service.getBook=getBook;
    service.bookList=getBookList;
    service.refreshList=refreshList;


    return service;

});


app.config(function($stateProvider, $urlRouterProvider ) {

    var indexState={
        name: 'index',
        url: '/',
        template: '<br><br><br>Boring Index file.  Try clicking <a ui-sref="books">Books</a> or <a ui-sref="books.book({bookId:1})">The Princess Bride</a>'
    };

    var booksState = {
        name: 'books',
        url:  '/books',
        controller: function($scope, books, BookService) {
            // check out the page on angular components (template/controller/bindings)
            // you can create a bindings: {books: '<'} in your component, and the books
            // variable will get added directly to your controller (mix with controller as syntax)
            // to get $ctl.books

            $scope.books=books;

            // the bookList is cached, so give an option to refresh the list.
            $scope.refreshList=BookService.refreshList;
        },
        templateUrl: "books.html",
        resolve: {
            books: function(BookService) {
                return BookService.bookList();

            }
        }
    };

    var counter=0;
    var bookState = {
        name: 'books.book',
        url: '/{bookId}',
        templateUrl: "book.html",
        controller: function($scope, $stateParams, book) {
            // like previous comment.. have to manually add stuff from the
            // resolve block to the scope.

            $scope.bookId=$stateParams.bookId;
            $scope.book=book;
        },
        resolve: {
            // cause a .1 second delay when switching to this state.
            // i think I just don't like the behavior when the resolve
            // block takes a while to resolve, so I probably won't ever
            // use this.  The "book" section below returns immediately.
            // it returns an object that is filled out later. That way the
            // view can render early, show a spinner, and fill in the details
            // when they arrive.
            
            //thing: function($q,$timeout) {
            //    var defer=$q.defer();
            //    $timeout(function() {
            //        console.log("thing resolving after .5 seconds");
            //        defer.resolve("thing");
            //    },100);
            //
            //    return defer.promise;
            //},
            book:   function(books, $stateParams,BookService) {
                return BookService.getBook($stateParams.bookId);
            }
        }
    };


    $stateProvider.state(indexState);
    $stateProvider.state(booksState);
    $stateProvider.state(bookState);

    $urlRouterProvider.otherwise("/");

});



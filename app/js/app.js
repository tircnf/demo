
var app=angular.module("app", ['ui.router']);



app.controller("ctrl", function($scope, $rootScope) {

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
        controller: function($scope, books, BookService,$timeout) {
            // check out the page on angular components (template/controller/bindings)
            // you can create a bindings: {books: '<'} in your component, and the books
            // variable will get added directly to your controller (mix with controller as syntax)
            // to get $ctl.books

            $scope.books=books;
            $scope.clearSearch=function() {
                // this yucky stuff is in here because of a bad interction with
                // ng-repeat and the ui.router active directive.
                // if you clear the query immeidately, I don't know why, but the
                // active class doesn't get removed from the old selected item.
                //
                // search box empty.  select Moby Dick.
                // then search for "Dune"  (moby dick disappears).
                // click "dune" (ng-click calls clearSearch).
                // all the old items come back, including Moby Dick which still has
                // the active flag.
                // $scope.digest or $scope.apply don't fix it.
                // reference this ticket which is closed, but does not fix the issue. :(
                // https://github.com/angular-ui/ui-router/issues/1997 (and 5 other tickets).
                $timeout(function() {
                    $scope.q="";
                },0);
            };

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




var app=angular.module("app", ['ui.router']);

app.controller("ctrl", function($scope) {
  $scope.scopedata="hello world from controller";

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
                    defer.resolve(books[$stateParams.bookId]);
                },500);

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



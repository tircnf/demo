
app.service('BookService', function($http, User) {

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

        User.touchUser();
        var promise=$http.get("/api/books").then(function(response)  {
            // response has {data:.., status:<number>, headers: <function(headerName)>, config: <object>, statusText: http status text}
            angular.extend(bookList, response.data);
            bookList.loading=false;
        }, function(error)  {
            console.error("Error... ",error);
            bookList.promise=undefined;
            bookList.loading=undefined;
            if (error.status===-1) {
                bookList.error="unknown error.  Probably a connection refused";
            } else {
                bookList.error=error.status + " " + error.statusText + ".  " + error.data;
            }
        });

        bookList.promise=promise;
        bookList.loading=true;
        bookList.error=undefined;

        return bookList;
    };

    var refreshList=function() {
        bookList.length=0;
        bookList.promise=undefined;
        bookList.loading=undefined;
        bookList.error=undefined;
        getBookList();
    };

    var getBook=function(id) {

        var book={id:id};

        User.touchUser();
        var promise=$http.get("/api/books/"+id).then(function(response) {
            angular.extend(book, response.data);
            book.loading=false;
        }, function(error) {
            console.error("Error... ",arguments);
            book.loading=undefined;
            book.promise=undefined;
            if (error.status===-1) {
                book.error="unknown error.  Probably a connection refused";
            } else {
                book.error=error.status + " " + error.statusText + ".  " + error.data;
            }
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



/* Define custom server-side HTTP routes for lineman's development server
 *   These might be as simple as stubbing a little JSON to
 *   facilitate development of code that interacts with an HTTP service
 *   (presumably, mirroring one that will be reachable in a live environment).
 *
 * It's important to remember that any custom endpoints defined here
 *   will only be available in development, as lineman only builds
 *   static assets, it can't run server-side code.
 *
 * This file can be very useful for rapid prototyping or even organically
 *   defining a spec based on the needs of the client code that emerge.
 *
 */


module.exports = {
  drawRoutes: function(app) {

    var cookieParser=require('cookie-parser');
    var bodyParser=require('body-parser');

    app.use(cookieParser());
    app.use(bodyParser.json());


    // how long our sessions last.
    var TIMEOUT=3;

    // some initial static content.

    // id must be a number because when the book is returned it sleeps for
    // id*100 ms before returning the book.
    var _bookList=[
        {id: 0, title: "Moby Dick", text: "blah blah moby dick.. big fist, etc", cover: "https://images-na.ssl-images-amazon.com/images/I/71Q4R237BZL.jpg"},
        {id: 1,title: "The Princess Bride", text: "As you wish... blah blah blah... big giant", cover: "https://images-na.ssl-images-amazon.com/images/I/510yzqD6ukL._SX302_BO1,204,203,200_.jpg"},
        {id: 2,title: "Charlie and the Chocolate Factory", text: "Eat lots and lots of chocolate.", cover: "https://i3.bookpage.com/books/images/e6494286946ac087ff804110b5692ffa/medium.jpg"},
        {id: 3, title: "This book causes a server error", text: "This book is not defined and will throw a 500 server error"},
        {id: 4,title: "The Mouse and his Child", text: "You have to find the last visible dog", cover: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/TheMouseAndHisChild.jpg/220px-TheMouseAndHisChild.jpg"},
        {id: 5,title: "Dune", text: "Lots of Sand... little mouse.. ", cover: "https://cf.geekdo-images.com/images/pic279251.jpg"},
        {id: 6,title: "Dune Messiah", text: "Is this the one where he goes blind? ", cover: "http://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1213426839i/117902._UY200_.jpg"}
        ];



    var _userlist= {};
    _userlist.mike={username: "mike", password: "mike", cookie: "", expires: new Date()};
    _userlist.luke={username: "luke", password: "luke", cookie: "", expires: new Date()};
    _userlist.user={username: "user", password: "password", cookie: "", expires: new Date()};

    var MYSESSIONID="MYSESSIONID";

    var getUser=function(req) {
        var cookie=req.cookies[MYSESSIONID];
        if (!cookie) {
            return false;
        }

        var tempUser=false;

        for(var username in _userlist) {
            if (_userlist[username].cookie==cookie) {
                tempUser=_userlist[username];
                break;
            }
        }

        if (tempUser) {
            if (userExpired(tempUser)) {
                console.log("user " + tempUser.username + " has expired cookie");
                tempUser=false;
            }
        }

        return tempUser;
    };

    var touchUser=function(user) {
        if (user) {
            var d = new Date();
            d.setMinutes(d.getMinutes()+TIMEOUT);
            user.expires=d;
        }
    };

    var userExpired=function(user) {
        var d=new Date();
        return d>user.expires;
    };

    // update the expires time for a user based on their cookie.
    // for use with pages that don't require a login, so don't call checkUser.
    // and don't reset the expires variable.

    var twiddle=function(req, res, next) {
        var user=getUser(req);
        touchUser(user);
        next();
    }

    var checkUser=function(req, res, next) {
           var user=getUser(req);
           if (!user) {
                denied(req, res, next);
           } else {
                touchUser(user);
                next();
           }
    };


    var denied=function(req, res, next) {
        res.status(403).send("You do not have permission");
    };


    app.get('/api/greeting/:message', twiddle, function(req, res){
      res.json({ message: "OK, "+req.params.message });
    });

    app.post('/api/login', function(req, res) {
        setTimeout(function() {
            var user=false;
            var testUser=_userlist[req.body.username];

            if (testUser && testUser.password===req.body.password) {
                var cookie=new Date().getTime();
                user=testUser;

                user.cookie=cookie;
                user.timeout=TIMEOUT;
                res.cookie(MYSESSIONID,user.cookie);
                touchUser(user);
            }

            res.json(user);
        }, 750);
    });

    app.post('/api/logout', function(req, res) {
        var user=getUser(req);
        if (!user) {

        } else {
            user.cookie="";
            user.expires=new Date();
        }

        res.json({});
    });

    app.get('/api/whoami', function(req,res) {
        setTimeout(function() {
            var user=getUser(req, res);
            touchUser(user);
            res.json(user);
        },750);
    });

    app.get('/api/books', checkUser, function(req, res) {
        setTimeout(function() {
            res.json(_bookList);
        }, 1500);
    });

    // allow users to post to /api/touch to reset the timer.
    app.post('/api/touch', checkUser, function(req, res) {
        setTimeout(function() {
            res.json({code:'ok.  you have been touched.'});
        }, 100);
    });



    app.get('/api/books/:id', checkUser, function(req, res) {
        // the req.params object is an array with extra properties.
        // it doesn't serialize or output an any way that I can figure out..
        // res.json(req.params) sends an empty array.
        // res.send(req.params) like you see in the docs sends an empty string.
        // console.log(req.params) shows an array with key.value pairs in node.  weird.
        // this code converts it to an object that could be sent back.
        //var foo={};
        //for(var junk in req.params) {
            //foo[junk]=req.params[junk];
        //}
        //res.json(foo);
        //
        setTimeout(function() {
            if (req.params.id==3) {
                res.status(500).send("Error.  Unable to mess with this book.");
            } else {
                res.json(_bookList[req.params.id]);
            }
        }, req.params.id*100);
    });
  }
};

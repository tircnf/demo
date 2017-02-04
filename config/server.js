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


// what happens with global variables here??

var _bookList=[
        {title: "Moby Dick", text: "blah blah moby dick.. big fist, etc"},
        {title: "The Princess Bride", text: "As you wish... blah blah blah... big giant"},
        {title: "Charlie and the Chocolate Factory", text: "Eat lots and lots of chocolate."},
        {title: "The Mouse and his Child", text: "You have to find the last visible dog"},
        {title: "Dune", text: "Lots of Sand... little mouse.. "},
        {title: "Dune Messiah", text: "Is this the one where he goes blind? "}
        ];


module.exports = {
  drawRoutes: function(app) {
    app.get('/api/greeting/:message', function(req, res){
      res.json({ message: "OK, "+req.params.message });
    });

    app.get('/api/books', function(req, res) {
        setTimeout(function() {
            res.json(_bookList);
        }, 1500);
    });

    app.get('/api/books/:id', function(req, res) {
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

        setTimeout(function() {
            if (req.params.id==3) {
                res.status(500).send("Error.  Unable to mess with this mouse and child");
            } else {
                res.json(_bookList[req.params.id]);
            }
        }, req.params.id*100);

    });
  }
};

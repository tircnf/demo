
// a service for logging in a user.

app.service('User', function($http) {

    var service={};

    var logged_in_user={valid:false};

    // remove all properties from the user object.
    var clearUser=function() {
        for(var key in logged_in_user) {
            if (logged_in_user.hasOwnProperty(key)) {
                delete logged_in_user[key];
            }
        }
        logged_in_user.valid=false;
    };

    var touchUser=function() {
        var d=new Date();
        d.setMinutes(d.getMinutes()+logged_in_user.timeout);
        logged_in_user.logOutTime=d;
    };

    // set the logged_in_user to the results of
    // a successful login request or whoami request.
    //
    var setUser=function(userData) {
        clearUser();
        logged_in_user.loading=false;
        angular.extend(logged_in_user, userData);
        logged_in_user.valid=true;
        touchUser();
    };


    // ask the server who is logged in.
    var whoami=function() {

        // when the app first starts, fire off a "whoami" request.
        // if we have a cookie, then we can get our user info back.
        // the promise is set up at the Service level so code can
        // to things after this promise resolves.
        // the use case for this is restoring the state if someone refreshes
        // the browser.
        // the main controller waits for this to resolve, and then
        // can reload any state.
        var promise= $http.get("/api/whoami").then(function(response) {
            if (response.data) {
                setUser(response.data);
            } else {
                clearUser();
            }
        });

        service.promise=promise;
        return promise;
    };

    // fires off the whoami request and marks the user as loading.

    var initialize=function() {
        clearUser();
        logged_in_user.loading=true;
        whoami();
    };


    // login and logout return their promises, so that callers can fire off an
    // event after they are done. (main controller naviates to index and reloads
    // the window).
    var logout=function() {
        return $http.post("/api/logout").then(function(response) {
            clearUser();
         });
    };

    var login=function(user) {
        logged_in_user.loading=true;
        var promise=$http.post("/api/login",user).then(function(response) {
            console.log("response.data for login = ",response.data);
            if (response.data) {
                setUser(response.data);
            } else {
                clearUser();
                user.loginMessage="login denied. Bad username/password";
            }
        }, function(response) {

        });

        return promise;
    };

    var timeLeft=function() {
        if (logged_in_user.valid) {
            var d=new Date();
            return Math.floor((logged_in_user.logOutTime-d)/1000);
        } else {
            return 0;
        }
    };

    console.log("calling initialize in UserService..");
    initialize();

    service.login=login;
    service.logout=logout;
    service.user=logged_in_user;
    service.timeLeft=timeLeft;
    service.touchUser=touchUser;


    return service;

});



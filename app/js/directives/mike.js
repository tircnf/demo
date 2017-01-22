
app.directive('mike', function() {
    return {
        restrict: "E",
        templateUrl: "mike.html",
        //template: "<b>my template,</b>",
        link: function(element, attrs) {
            console.log("link function running");
            console.log("element ",element);
            console.log("attrs ", attrs);
        },
        controller: function($scope) {
            console.log("controller function running for directive 'mike'");
            console.log("$scope = ",$scope);
            
            $scope.message="My message from the scope";
        }
    };
});


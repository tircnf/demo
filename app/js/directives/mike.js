
app.directive('mike', function() {
    return {
        restrict: "E",
        templateUrl: "mike.html",
        //template: "<b>my template,</b>",
        link: function(scope,element, attrs) {
            //console.log("scope = ",scope);
            //console.log("element = ",element);
            //console.log("attrs = ",attrs);

        },
        controller: function($scope) {
            $scope.message="MIKE WAS HERE";
        }
    };
});


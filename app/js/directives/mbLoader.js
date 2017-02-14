


// dont use a name like "mb-loader" here.. must be camelcase.
app.directive("mbLoader", function() {

    var defaultImage="bar";

    return {
        restrict: "A",
        transclude: true,
        scope: {
            mbLoader: "=",
            mbImage: "@"
        },
        link: function(scope, element, attrs, controller, transccludeFn) {
        },
        controller: function($scope) {
            var image=$scope.mbImage||defaultImage;
            $scope.imageUrl="img/ajax-loader-" + image + ".gif";
        },
        templateUrl: 'mbLoader.html'
    };
});


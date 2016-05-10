var myApp = angular.module('myApp', []);
myApp.controller('actionController', ['$scope', '$http', function($scope, $http){
	console.log("DFSSDFSDFSDFSDFSDFSDFSDFSD");
	
	$http.get('/').success(function(response){
		console.log("I got data");
		$scope.all_comments = response;
	});
}]);

/**
var actionComment = angular.module('actionComment', []);
actionComment.controller('actionCommentController',aCC);
function aCC($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/')
        .success(function(data) {
            $scope.all_comments = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createComment = function() {
        $http.post('/', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.all_comments = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteComment = function(id) {
        $http.delete('/' + id)
            .success(function(data) {
                $scope.all_comments = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
**/

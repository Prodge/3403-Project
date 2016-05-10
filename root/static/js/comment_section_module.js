angular.module('actionComment', [])

.factory('commentService', ['$http',function($http) {
	return {
		get : function() {
			console.log("im herer");
			return $http.get('/comments/get');
		},
		create : function(todoData) {
			console.log("create heree");
			return $http.post('/comments/create', todoData);
		},
		delete : function(id) {
			return $http.delete('/comments/delete/' + id);
		}
	}
}])

.controller('commentController', ['$scope','$http','commentService', function($scope, $http, commentService) {
	$scope.formData = {};

	commentService.get().success(function(data) {
		$scope.all_comments = data;
	});
	
	$scope.createComment = function() {
		if ($scope.formData.thought != undefined) {
			commentService.create($scope.formData).success(function(data) {
				$scope.formData = {};
				$scope.all_comments = data; // assign our new list of todos
			});
		}
	};
	
	$scope.deleteComment = function(id) {
		commentService.delete(id).success(function(data) {
			$scope.all_comments = data; // assign our new list of todos
		});
	};
}]);

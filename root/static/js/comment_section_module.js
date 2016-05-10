angular.module('actionComment', [])

.factory('commentService', ['$http',function($http) {
	return {
		get : function() {
			console.log("im herer");
			return $http.get('/comments/get');
		},
		getLatest : function() {
			return $http.get('/comments/getlatest');
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

.controller('commentController', ['$scope','$http','commentService','$interval','$document', function($scope, $http, commentService, $interval, $document) {
	$scope.formData = {};
	
	function hellowimo(){
		commentService.getLatest().success(function(data) {
			if ($scope.all_comments[$scope.all_comments.length-1]["_id"]!=data[0]["_id"]){
				$scope.all_comments.push(data[0]);
			}
		});
	}

	$interval(hellowimo, 2500);

	commentService.get().success(function(data) {
		$scope.all_comments = data;
	});
	
	$scope.createComment = function() {
		if ($scope.formData.thought != undefined) {
			commentService.create($scope.formData).success(function(data) {
				$scope.formData = {};
				$scope.all_comments.push(data[0]); // assign our new list of todos
			});
		}
	};
	
	$scope.deleteComment = function(id) {
		commentService.delete(id).success(function(data) {
			$scope.all_comments = data; // assign our new list of todos
		});
	};
}]);

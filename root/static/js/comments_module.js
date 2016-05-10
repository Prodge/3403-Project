angular.module('commentApp', [])

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
		edit : function(id,todoData) {
			return $http.put('/comments/edit/' + id, todoData);
		},
		delete : function(id) {
			return $http.delete('/comments/delete/' + id);
		}
	}
}])

.controller('commentController', ['$scope','$http','commentService', function($scope, $http, commentService) {
	$scope.formData = {};
	
	commentService.get().success(function(data) {
		$scope.all_comments = loadNames(data);
	});

	function loadNames(data){
		$scope.editform = {};
		for (var i=0; i<data.length; i++){
			data[i]["textboxname"] = "A"+data[i]["_id"];
			eval("$scope.editform."+data[i]["textboxname"]+"=data[i]['thought']");
		}
		return data;
	}

	$scope.createComment = function() {
		if ($scope.formData.thought != undefined) {
			commentService.create($scope.formData).success(function(data) {
				$scope.formData = {};
				$scope.all_comments = loadNames(data);
			});
		}
	};

	$scope.editComment = function(id) {
		commentService.edit(id,$scope.editform).success(function(data) {
			$scope.all_comments = loadNames(data);
		});
	};
	
	$scope.deleteComment = function(id) {
		commentService.delete(id).success(function(data) {
			$scope.all_comments = loadNames(data);
		});
	};
}]);

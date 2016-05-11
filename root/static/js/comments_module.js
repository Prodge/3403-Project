angular.module('commentApp', ['angularMoment'])

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

.controller('commentController', ['$scope','$http','commentService','$timeout', function($scope, $http, commentService,$timeout) {
	$scope.formData = {};

	function dothis(){
		$scope.$watch('$viewContentLoaded',function(){
			$timeout(showHideStuff,500);
		});
	}

	function showHideStuff(){
		$(".showhideme").click(function(){
			var parentdiv = $(this).parent().closest('div');
      parentdiv.find(".editcontrols").toggle();
		});
	}

	commentService.get().success(function(data) {
		$scope.all_comments = loadNames(data);
		dothis();
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
				dothis();
			});
		}
	};

	$scope.editComment = function(id) {
		commentService.edit(id,$scope.editform).success(function(data) {
			$scope.all_comments = loadNames(data);
			dothis();
		});
	};

	$scope.deleteComment = function(id) {
		commentService.delete(id).success(function(data) {
			$scope.all_comments = loadNames(data);
			dothis();
		});
	};
}]);

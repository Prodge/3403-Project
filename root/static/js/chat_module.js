angular.module('gameChat', [])

.factory('chatService', ['$http',function($http) {
	return {
		get : function() {
			return $http.get('/chat/get');
		},
		getLatest : function() {
			return $http.get('/chat/getlatest');
		},
		create : function(todoData) {
			return $http.post('/chat/create', todoData);
		}
	}
}])

.controller('chatController', ['$scope','$http','chatService','$interval', function($scope, $http, chatService, $interval) {
	$scope.formData = {};
	
	function refreshChat(){
		chatService.getLatest().success(function(data) {
			if ($scope.full_chat[$scope.full_chat.length-1]["_id"]!=data[0]["_id"]){
				$scope.full_chat.push(data[0]);
			}
		});
	}

	$interval(refreshChat, 2500);

	chatService.get().success(function(data) {
		$scope.full_chat = data;
	});
	
	$scope.createChat = function() {
		if ($scope.formData.thought != undefined) {
			chatService.create($scope.formData).success(function(data) {
				$scope.formData = {};
				$scope.full_chat.push(data[0]); // assign our new list of todos
			});
		}
	};
}]);

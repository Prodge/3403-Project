angular.module('commentService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Comments', ['$http',function($http) {
		return {
			get : function() {
				console.log("im herer");
				return $http.get('/get/comments');
			},
			create : function(todoData) {
				return $http.post('/comments', todoData);
			},
			delete : function(id) {
				return $http.delete('/comments/' + id);
			}
		}
	}]);

angular.module('commentController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scoipe','$http','Comments', function($scope, $http, Comments) {
		$scope.formData = {};
		//$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Comments.get()
			.success(function(data) {
				$scope.all_comments = data;
				//$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createComment = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.name != undefined) {
				//$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Comments.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						//$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.all_comments = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteComment = function(id) {
			//$scope.loading = true;

			Comments.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					//$scope.loading = false;
					$scope.all_comments = data; // assign our new list of todos
				});
		};
	}]);

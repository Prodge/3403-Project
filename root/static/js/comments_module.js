angular.module('commentApp', ['angularMoment'])

.factory('commentService', ['$http',function($http) {
  function getSendHeader(){
    cookies = document.cookie.split(';');
    cookie = cookies.filter(function(cookie){
      name = cookie.split('=')[0];
      return name == 'auth_token'
    });
    return {headers: {'Authorization':cookie[0].split('=')[1]}};
  }
  return {
    get : function() {
      return $http.get('/api/comments-get', getSendHeader());
    },
    create : function(formdata) {
      return $http.post('/api/comments-create', formdata, getSendHeader());
    },
    edit : function(id,formdata) {
      return $http.put('/api/comments-edit' + id, formdata, getSendHeader());
    },
    delete : function(id) {
      return $http.delete('/api/comments-delete' + id, getSendHeader());
    }
  }
}])

.controller('commentController', ['$scope','$http','commentService','$timeout', function($scope, $http, commentService,$timeout) {
  $scope.createForm = {};

  function checkContentLoaded(){
    $scope.$watch('$viewContentLoaded',function(){
      $timeout(toggleEditForm,500);
    });
  }

  function toggleEditForm(){
    $(".editLink").click(function(){
      var parentdiv = $(this).parent().closest('div');
      parentdiv.find(".editControls").toggle(toggle_speed);
    });
  }

  //loads in ng-model names
  function loadNames(data){
    $scope.editForm = {};
    for (var i=0; i<data.length; i++){
      data[i]["textboxname"] = "A"+data[i]["_id"];
      eval("$scope.editForm."+data[i]["textboxname"]+"=data[i]['thought']");
    }
    return data;
  }

  commentService.get().success(function(data) {
    $scope.all_comments = loadNames(data);
    checkContentLoaded();
  });


  $scope.createComment = function() {
    if ($scope.createForm.thought != undefined) {
      commentService.create($scope.createForm).success(function(data) {
        $scope.createForm = {};
        $scope.all_comments = loadNames(data);
        checkContentLoaded();
      });
    }
  };

  $scope.editComment = function(id) {
    commentService.edit(id,$scope.editForm).success(function(data) {
      $scope.all_comments = loadNames(data);
      checkContentLoaded();
    });
  };

  $scope.deleteComment = function(id) {
    commentService.delete(id).success(function(data) {
      $scope.all_comments = loadNames(data);
      checkContentLoaded();
    });
  };
}]);

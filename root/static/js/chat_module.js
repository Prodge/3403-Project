angular.module('gameChat', [])

.factory('chatService', ['$http',function($http) {
    return {
       get : function() {return $http.get('/chat/get');},
       getLatest : function() {return $http.get('/chat/getlatest');},
       create : function(formData) {return $http.post('/chat/create', formData);}
    }
}])

.controller('chatController', ['$scope','$http','chatService','$interval', function($scope, $http, chatService, $interval) {
    $scope.createForm = {};

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
       if ($scope.createForm.thought != undefined) {
          chatService.create($scope.createForm).success(function(data) {
             $scope.createForm = {};
             $scope.full_chat.push(data[0]);
          });
       }
    };
}]);

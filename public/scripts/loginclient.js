var myApp = angular.module('myApp', []);

myApp.controller("LoginController", ["$scope", '$http', '$window', function($scope, $http, $window){

  $scope.voiceLogIn = function(){
    var userInfo = {
      username: $scope.username,
      password: $scope.password
    };
    $http({
      method: 'POST',
      url: '/login',
      data: userInfo
    }).then(function successCallback(response) {
      $window.location.href = '/';
    }, function errorCallback(error) {
      $window.location.href = '/';
    });
  };

  $scope.displayLogIn = function(){

  };


}]);

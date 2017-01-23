var myApp = angular.module('myApp', []);

myApp.controller("LoginController", ["$scope", '$http', '$window', function($scope, $http, $window){
  console.log('inside login controller');

  $scope.loginInput = function(){
    var userInfo = {
      username: $scope.username,
      password: $scope.password
    };
    $http({
      method: 'POST',
      url: '/login',
      data: userInfo
    }).then(function successCallback(response) {
      console.log(response);
      $window.location.href = '/';
    }, function errorCallback(error) {
      console.log('error', error);
      $window.location.href = '/';
    });
  };
}]);

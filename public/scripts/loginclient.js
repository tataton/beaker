var myApp = angular.module('myApp', []);

myApp.controller("LoginController", ["$scope", '$http', '$window', function($scope, $http, $window){

  $scope.logIn = function(displayUser){
    var sentUsername;
    if (displayUser) {
      sentUsername = displayUser;
      sessionStorage.setItem('deviceName', $scope.devicename);
    } else {
      sentUsername = $scope.username;
    }
    var userInfo = {
      username: sentUsername,
      password: $scope.password
    };
    console.log(userInfo);
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
}]);

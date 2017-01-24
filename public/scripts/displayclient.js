var myApp = angular.module('myApp', []);

myApp.factory('SocketService', function($rootScope) {
  /* Adapted from Brian Ford's article on using socket.io
  within Angular controllers
  (http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/).
  This should probably be constructed as an angular.service rather than
  as a factory, but I don't know how to do that yet. In fact, Brian went on
  to publish an angular module (https://github.com/btford/angular-socket-io)
  that provides expanded functionality, but I really only need the
  service. */
  var socket = io.connect();
  var service = {};
  service.on = function(eventName, callback) {
    socket.on(eventName, function() {
      var args = arguments;
      $rootScope.$apply(function() {
        callback.apply(socket, args);
      });
    });
  };
  service.emit = function (eventName, data, callback) {
    socket.emit(eventName, data, function() {
      var args = arguments;
      $rootScope.$apply(function() {
        if (callback) {
          callback.apply(socket, args);
        }
      });
    });
  };
  return service;
});

myApp.controller("NavController", ["$scope", "$http", function($scope, $http) {

  $scope.devicename = sessionStorage.getItem('deviceName');

  $scope.logMeOut = function(){
    $http({
      method: 'GET',
      url: '/logout'
    }).then(function(){
      location.reload(true);
    });
  };
}]);

myApp.controller("DisplayController", ["$scope", "$http", "SocketService", function($scope, $http, SocketService) {
  $scope.helloworld = 'Hello World!';
  SocketService.on('get-devicename', function(){
    var devicename = sessionStorage.getItem('deviceName');
    SocketService.emit('set-devicename', devicename);
  });
}]);

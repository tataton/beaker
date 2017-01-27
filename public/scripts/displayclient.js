var myApp = angular.module('myApp', []);

// Add array comparison method 'equals' to Array prototype:
Array.prototype.equals = function(array){
    // If the other array is a falsy value, return false.
    if (!array)
        return false;
    // If arrays have different length, return false.
    if (this.length != array.length)
        return false;
    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays:
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // Recurse into the nested arrays:
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

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
  $scope.commandsToDisplay = [];
  $scope.unallocatedDisplays = [];
  SocketService.on('get-devicename', function(){
    var devicename = sessionStorage.getItem('deviceName');
    SocketService.emit('set-devicename', devicename);
  });
  SocketService.on('display-activate', function(assignedTo){
    $scope.associatedUser = assignedTo;
    $scope.commandsToDisplay = [];
  });
  SocketService.on('display-deactivate', function(){
    $scope.associatedUser = '';
    $scope.commandsToDisplay = [];
  });
  SocketService.on('update-commands', function(currentCommandList){
    $scope.commandsToDisplay = currentCommandList;
  });
  SocketService.on('available-displays', function(availableDisplays){
    $scope.unallocatedDisplays = availableDisplays;
  });
  SocketService.on('update-notebook', function(notebookArray){
    $scope.notebookEntriesToDisplay = notebookArray;
  });
}]);

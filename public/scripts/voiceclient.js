var socket = io();

var myApp = angular.module('myApp', ['ngRoute']);

myApp.factory('AnnyangService', function($rootScope) {
  /* Adadpted from Levi Thomason's angular-annyang
  (https://github.com/levithomason/angular-annyang). This
  factory is specifically devoted to making annyang
  available across angular controllers.

  I believe that this should be re-written as an Angular
  service (myApp.service), but I don't know how to do that
  yet. Something for the future.*/
  var service = {};
  service.commands = {};
  /* Command array; do not pre-populate. New commands need
  to be added through the addCommands route, so that their
  annyang properties can be bound to $rootScope. */

  service.addCommand = function(phrase, callback){
    var command = {};

    // Wrap annyang command in scope apply:
    command[phrase] = function(args){
      $rootScope.$apply(callback(args));
    };

    /* Extend our commands list (copy enumerable properties)
    of command to service.commands): */
    angular.extend(service.commands, command);

    // Make commands in service.commands available to annyang:
    annyang.addCommands(service.commands);
    console.debug('added command "' + phrase + '"', service.commands);
  };

  service.start = function(){
    annyang.addCommands(service.commands);
    annyang.debug(true);
    annyang.start();
  };

  return service;
});

myApp.controller("NavController", ["$scope", "$http", function($scope, $http) {
  $http({
    method: 'GET',
    url: '/user_data'
  }).then(function(response){
    $scope.currentUser = response.data.username;
  });

  $scope.voiceLogOut = function(){
    $http({
      method: 'GET',
      url: '/logout'
    }).then(function(){
      location.reload(true);
    });
  };
}]);

myApp.controller("InputController", ["$scope", "$http", "AnnyangService", function($scope, $http, AnnyangService) {

  $scope.init = function() {
    // $scope.clearResults();

    AnnyangService.addCommand('beaker', function() {
      if ($scope.instructArray.length === 0) {
        $scope.appendInstruct('beaker');
      }
    });

    AnnyangService.addCommand('clear', function() {
      $scope.clearInstructArray();
    });

    AnnyangService.addCommand('*allSpeech', function(allSpeech) {
      console.debug(allSpeech);
      $scope.addResult(allSpeech);
    });

    AnnyangService.start();
  };

  $scope.clearInstructArray = function(){
    $scope.instructArray = [];
  };

  $scope.appendInstruct = function(command) {
    $scope.instructArray.push(command);
    var objectToSend = {instructArray: $scope.instructArray};
    $http({
      method: 'POST',
      url: '/command_update',
      data: objectToSend
    });
  };

  $scope.helloworld = "Hello World!";

  $scope.addResult = function(result) {
    $scope.results.push({
      content: result,
      date: new Date()
    });
  };

  // $scope.clearResults = function(){
  //   var objectToSend = {sayingsArray: $scope.results};
  //   $http({
  //     method: 'POST',
  //     url: '/sayings',
  //     data: objectToSend
  //   }).then(function(){
  //     $scope.results = [];
  //   });
  // };
  //
  // $scope.pastResults = function(){
  //   $http({
  //     method: 'GET',
  //     url: '/sayings'
  //   }).then(function(response){
  //     $scope.results = response.data.sayingsArray;
  //   });
  // };
  $scope.clearInstructArray();
  $scope.init();
}]);

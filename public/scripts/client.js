var socket = io();

var myApp = angular.module('myApp', ['ngRoute']);

myApp.factory('AnnyangService', function($rootScope){
  /* Adadpted from Levi Thomason's angular-annyang
  (https://github.com/levithomason/angular-annyang). This
  factory is specifically devoted to making annyang
  available across angular controllers. */

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

    // Add the commands to annyang:
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

myApp.controller("NavController", ["$scope", function($scope){

}]);

myApp.controller("InputController", ["$scope", "$http", "AnnyangService", function($scope, $http, AnnyangService){

  $scope.init = function() {
    $scope.clearResults();

    AnnyangService.addCommand('hello', function(){
      alert('Hi there!');
    });

    AnnyangService.addCommand('*allSpeech', function(allSpeech){
      console.debug(allSpeech);
      $scope.addResult(allSpeech);
    });

    AnnyangService.start();
  };

  $scope.helloworld = "Hello World!";

  $scope.addResult = function(result){
    $scope.results.push({
      content: result,
      date: new Date()
    });
  };

  $scope.clearResults = function(){
    var objectToSend = {sayingsArray: $scope.results};
    $http({
      method: 'POST',
      url: '/sayings',
      data: objectToSend
    }).then(function(){
      $scope.results = [];
    });
  };

  $scope.pastResults = function(){
    $http({
      method: 'GET',
      url: '/sayings'
    }).then(function(response){
      $scope.results = response.data.sayingsArray;
    });
  };

  $scope.init();
}]);

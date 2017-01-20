console.log('js sourced!');

var myApp = angular.module('myApp', []);

myApp.factory('AnnyangService', function($rootScope){
  var service = {};
  
  // COMMANDS
  service.commands = {};

  service.addCommand = function(phrase, callback){
    var command = {};

    // Wrap annyang command in scope apply
    command[phrase] = function(args){
      $rootScope.$apply(callback(args));
    };

    // Extend our commands list
    angular.extend(service.commands, command);

    // Add the commands to annyang
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

myApp.controller("MainController", ["$scope", "$http", "AnnyangService", function($scope, $http, AnnyangService){

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

console.log('js sourced!');

var myApp = angular.module('myApp', []);

// myApp.factory('annyangService', function(){
//    var annyangService = {};
//    console.log('In AnnyangService factory setup.');
//    annyangService.sourced = "Factory working!";
//    return annyangService;
// });

myApp.factory('AnnyangService', function($rootScope){
  var service = {};
  console.log('In AnnyangService factory setup.');
  service.sourced = "Factory working!";
  // COMMANDS
  service.commands = {};

  service.addCommand = function(phrase, callback) {
      var command = {};

      // Wrap annyang command in scope apply
      command[phrase] = function(args) {
          $rootScope.$apply(callback(args));
      };

      // Extend our commands list
      angular.extend(service.commands, command);

      // Add the commands to annyang
      annyang.addCommands(service.commands);
      console.debug('added command "' + phrase + '"', service.commands);
  };

  service.start = function() {
      annyang.addCommands(service.commands);
      annyang.debug(true);
      annyang.start();
      var listeningTest = annyang.isListening();
      console.log("Is annyang listening? ", listeningTest);
  };

  return service;
});

myApp.controller("MainController", ["$scope", "AnnyangService", function($scope, AnnyangService){
  $scope.sourced = "angular sourced!";
  $scope.factorysourced = AnnyangService.sourced;

  $scope.init = function() {
      $scope.clearResults();

      AnnyangService.addCommand('*allSpeech', function(allSpeech) {
          console.debug(allSpeech);
          $scope.addResult(allSpeech);
      });

      AnnyangService.start();
  };

  $scope.addResult = function(result) {
      $scope.results.push({
          content: result,
          date: new Date()
      });
  };

  $scope.clearResults = function() {
      $scope.results = [];
  };

  $scope.init();
}]);

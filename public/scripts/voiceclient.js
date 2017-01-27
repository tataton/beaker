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

  $scope.logMeOut = function(){
    $http({
      method: 'GET',
      url: '/logout'
    }).then(function(){
      location.reload(true);
    });
  };
}]);

myApp.controller("InputController", ["$scope", "$http", "AnnyangService", function($scope, $http, AnnyangService) {

  var expectingDisplay = false;
  var expectingNotebookEntries = false;
  var expectingSearchString = false;
  var availableDisplayArray = [];
  var myDisplayArray = [];
  var notebookEntries = [];

  $scope.init = function() {
    // $scope.clearResults();

    AnnyangService.addCommand('beaker', function() {
      if ($scope.instructArray.length === 0) {
        appendInstruct('beaker');
      }
    });

    AnnyangService.addCommand('clear', function() {
      clearAll();
    });

    AnnyangService.addCommand('display', function() {
      console.log('Hit display command set.');
      if ($scope.instructArray.equals(['beaker'])) {
        appendInstruct('display');
        expectingDisplay = true;
        $http({
          method: 'POST',
          url: '/command/getDisplays',
          data: {}
        }).then(function(response){
          availableDisplayArray = response.data.displayArray;
        });
      }
    });

    AnnyangService.addCommand('notebook', function(){
      console.log('Hit notebook command set.');
      if ($scope.instructArray.equals(['beaker'])) {
        appendInstruct('notebook');
        expectingNotebookEntries = true;
      }
    });

    AnnyangService.addCommand('stop notebook', function(){
      console.log('Ending notebook entries.');
      $http({
        method: 'POST',
        url: '/notebook',
        data: {
          timestamp: new Date(),
          entries: notebookEntries
        }
      }).then(function(){
        clearAll();
      });
    });

    AnnyangService.addCommand('search', function(){
      console.log('Notebook search.');
      if ($scope.instructArray.equals(['beaker'])) {
        appendInstruct('search');
        expectingSearchString = true;
      }
    });

    AnnyangService.addCommand('*allSpeech', function(allSpeech) {
      if ((expectingDisplay) && (availableDisplayArray.includes(allSpeech))) {
        var displayToActivate = {display: allSpeech};
        $http({
          method: 'POST',
          url: '/command/activateDisplay',
          data: displayToActivate
        }).then(function(){
          clearAll();
          myDisplayArray.push(allSpeech);
        });
      } else if (expectingNotebookEntries) {
        notebookEntries.push(allSpeech);
        $http({
          method: 'POST',
          url: '/command/updateNotebook',
          data: {notebookArray: notebookEntries}
        });
      } else if (expectingSearchString) {
        $http({
          method: 'POST',
          url: '/command/searchNotebook',
          data: {searchString: allSpeech}
        });
        clearAll();
      }
      console.debug(allSpeech);
    });

    AnnyangService.start({autoRestart: true, continuous: false});
  };

  var clearAll = function(){
    $scope.instructArray = [];
    notebookEntries = [];
    availableDisplayArray = [];
    expectingDisplay = false;
    expectingNotebookEntries = false;
    expectingSearchString = false;
    $http({
      method: 'POST',
      url: '/command/updateCommands',
      data: {instructArray: []}
    });
    $http({
      method: 'POST',
      url: '/command/updateNotebook',
      data: {notebookArray: []}
    });
  };

   var appendInstruct = function(command) {
    $scope.instructArray.push(command);
    var objectToSend = {instructArray: $scope.instructArray};
    $http({
      method: 'POST',
      url: '/command/updateCommands',
      data: objectToSend
    });
  };

  $scope.notices = [
    "Voice client activated.",
    "If browser requests permission to access microphone, press 'Allow'.",
    "Red circle in the browser tab means B.E.A.K.E.R. is listening."
  ];

  clearAll();
  $scope.init();
}]);

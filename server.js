var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('./strategies/userStrategy');
var socket = require('socket.io');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(express.static('public'));

// Express-session settings
var oneHour = 3600000; // milliseconds
app.use(session({
   secret: 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: oneHour, secure: false }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routers
var indexRouter = require('./routers/indexRouter');
app.use('/', indexRouter);
var adminRouter = require('./routers/adminRouter');
app.use('/admin', adminRouter);
var loginRouter = require('./routers/loginRouter');
app.use('/login', loginRouter);
var userDataRouter = require('./routers/userDataRouter');
app.use('/user_data', userDataRouter);
var logoutRouter = require('./routers/logoutRouter');
app.use('/logout', logoutRouter);
var notebookRouter = require('./routers/notebookRouter');
app.use('/notebook', notebookRouter);

// Server listening
var server = app.listen(port, function() {
  console.log('Server up on port ' + port + '.');
});

// MongoDB/mongoose setup
var mongoURI = "mongodb://localhost:27017/beakerDatabase";
var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function(err) {
    console.log('Mongodb connection error:', err);
});
MongoDB.once('open', function() {
  console.log('Mongodb connection open!');
});

// Socket.io setup
var io = socket(server);
var devices = [];
// Array of DisplayDevice objects.
var currentCommandList = [];

function DisplayDevice (deviceName, socketID) {
  // Display device constructor.
  this.deviceName = deviceName;
  this.socketID = socketID;
  // this.assignedTo will be added once user is bound to device.
}

io.sockets.on('connection', function(socket){
  socket.emit('get-devicename');
  socket.on('set-devicename', function(devicename){
    devices.push(new DisplayDevice(devicename.toLowerCase(), socket.id));
    console.log('Devices: ', devices);
  });
  console.log('New socket id: ' + socket.id);
  socket.on('disconnect', function(){
    console.log('Socket ' + socket.id + ' disconnected.');
    var deviceIndexToDelete = devices.findIndex(function(device){
      return (device.socketID == socket.id);
    });
    devices.splice(deviceIndexToDelete, 1);
  });
});

app.post('/command/:directive', function(req, res){
  console.log('Command route hit. Directive: ', req.params.directive);
  var i;
  var findAvailableDisplayNames = function(){
    var availableDisplayNames = [];
    var availableDisplays = devices.filter(function(device){
      return !(device.assignedTo);
    });
    for (i = 0; i < availableDisplays.length; i++) {
      availableDisplayNames.push(availableDisplays[i].deviceName);
    }
    return availableDisplayNames;
  };
  var broadcastAvailableDisplays = function(){
    io.sockets.emit('available-displays', findAvailableDisplayNames());
  };
  switch (req.params.directive) {
    case 'activateDisplay':
      var deviceIndexToActivate = devices.findIndex(function(device){
        return (device.deviceName == req.body.display);
      });
      devices[deviceIndexToActivate].assignedTo = req.user.username;
      io.to(devices[deviceIndexToActivate].socketID).emit('display-activate', req.user.username);
      res.sendStatus(200);
      broadcastAvailableDisplays();
      break;
    case 'getDisplays':
      res.send({displayArray: findAvailableDisplayNames()});
      broadcastAvailableDisplays();
      break;
    case 'deactivateDisplay':
      var deviceIndexToDeactivate = devices.findIndex(function(device){
        return (device.deviceName == req.body.display);
      });
      delete devices[deviceIndexToDeactivate].assignedTo;
      io.to(devices[deviceIndexToDeactivate].socketID).emit('display-deactivate');
      res.sendStatus(200);
      broadcastAvailableDisplays();
      break;
    case 'updateCommands':
      currentCommandList = req.body.instructArray;
      console.log("Current command list: ", currentCommandList);
      console.log("Current device list: ", devices);
      console.log("req.user.username: ", req.user.username);
      for (i = 0; i < devices.length; i++) {
        if (devices[i].assignedTo == req.user.username) {
          io.to(devices[i].socketID).emit('update-commands', currentCommandList);
        }
      }
      res.sendStatus(200);
      break;
    case 'updateNotebook':
      for (i = 0; i < devices.length; i++) {
        if (devices[i].assignedTo == req.user.username) {
          io.to(devices[i].socketID).emit('update-notebook', req.body.notebookArray);
        }
      }
      res.sendStatus(200);
      break;
    case 'searchNotebook':
      var Note = require('./models/notebook');
      var searchTerm = new RegExp(req.body.searchString);
      Note.findOne({entries: {$in: [searchTerm]}}, function(err, searchResult) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          console.log(searchResult);
          for (i = 0; i < devices.length; i++) {
            if (devices[i].assignedTo == req.user.username) {
              io.to(devices[i].socketID).emit('search-notebook', searchResult);
            }
          }
          res.sendStatus(200);
        }
      });
      break;
  }
});

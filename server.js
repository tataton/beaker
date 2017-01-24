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
io.sockets.on('connection', function(socket){
  console.log('New socket id: ' + socket.id);
  socket.on('disconnect', function(){
    console.log('Socket ' + socket.id + ' disconnected.');
  });
});

app.post('/command_update', function(req, res){
  
});

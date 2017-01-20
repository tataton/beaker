// var fs = require('fs');
// var https = require('https');
// var http = require('http');
// var https_port = process.env.PORT || 8080;
var port = process.env.PORT || 8080;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// HTTPS setup
// var sslOptions = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
//   passphrase: 'beaker'
// };
//
// https.createServer(sslOptions, app).listen(https_port);
// console.log('Server listening on port ' + https_port + '.');

// HTTP setup
app.listen(port, function() {
  console.log('Server listening on port ' + port + '.');
});

// Routes
var index = require('./routers/index');
app.use('/', index);

var theThingsISaidLastTime = [];

app.post('/sayings', function(req, res) {
  theThingsISaidLastTime = req.body.sayingsArray;
  res.sendStatus(200);
});

app.get('/sayings', function(req, res) {
  var objectToSend = {sayingsArray: theThingsISaidLastTime};
  res.send(objectToSend);
});

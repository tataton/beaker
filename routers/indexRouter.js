var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
  console.log("Base URL hit.");
  if ((req.isAuthenticated()) && (req.user.username == 'display')) {
      console.log("User requests display client.");
      var displayPath = path.join(__dirname, '../public/views/display.html');
      res.sendFile(displayPath);
  } else if ((req.isAuthenticated()) && (req.user.username)){
      console.log("User is authenticated.");
      var voicePath = path.join(__dirname, '../public/views/voice.html');
      res.sendFile(voicePath);
  } else {
    console.log("User needs authentication.");
    var loginPath = path.join(__dirname, '../public/views/login.html');
    res.sendFile(loginPath);
  }
});

module.exports = router;

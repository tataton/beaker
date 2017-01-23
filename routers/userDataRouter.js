var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
  console.log("User_data URL hit.");
  if (req.isAuthenticated()) {
    var userInfo = {username: req.user.username};
    res.status(200).send(userInfo);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;

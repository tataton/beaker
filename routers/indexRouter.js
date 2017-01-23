var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
  console.log("Base URL hit.");
  console.log(req);
  if (req.isAuthenticated()) {
    console.log("User is authenticated.");
  //   if (req.user.role == "admin") {
  //     console.log("Admin detected.");
  //     var adminPath = path.join(__dirname, '../public/views/admin.html');
  //     res.sendFile(adminPath);
  //   } else {
  //     console.log("User detected.");
      var indexPath = path.join(__dirname, '../public/views/index.html');
      res.sendFile(indexPath);
  //   }
  } else {
    console.log("User needs authentication.");
    var loginPath = path.join(__dirname, '../public/views/login.html');
    res.sendFile(loginPath);
  }
});

module.exports = router;

/* Handles admin page, for adding new user and admin accounts.
*/

var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

var UserSchema = require('../models/user');

router.post('/', function(req, res) {
  console.log('In adminRouter.');
  // if ((req.isAuthenticated()) && (req.user.role == "admin")) {
    var sentUser = req.body;
    UserSchema.create(sentUser, function(err, response) {
      if (err) {
        next(err);
      } else {
        res.status(201).send({message: "new user created successfully"});
      }
    });
  // } else {
  //   alert('Error in admin privileges. Please log in.');
  //   req.logout();
  //   res.redirect('/');
  // }
});

module.exports = router;

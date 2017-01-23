var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

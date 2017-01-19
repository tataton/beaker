var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res){
  console.log('Base url hit.');
  res.sendFile(path.resolve('index.html'));
});

module.exports = router;

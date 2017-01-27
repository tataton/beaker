var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Note = require('../models/notebook');

router.post('/', function(req, res) {
  console.log('Notebook entry route hit.');
  // console.log('req.body: ', req.body);
  // // Assemble notebook entry to add via mongoose.
  // var newNote = new Note({
  //   owner: req.user.username,
  //   timestamp: req.body.timestamp,
  //   entries: req.body.entries
  // });
  // // Save the notebook entry in the database.
  // newNote.save(function(err) {
  //   if (err) {
  //     console.log(err);
  //     res.sendStatus(500);
  //   } else {
  //     console.log('Added new notebook entry.');
  //     res.sendStatus(201);
  //   }
  // });
});

module.exports = router;

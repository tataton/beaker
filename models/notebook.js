var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notebookSchema = new Schema({
  owner: String,
  timestamp: String,
  entries: Array
});

var Note = mongoose.model('notes', notebookSchema);
module.exports = Note;

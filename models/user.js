/* Modified from our Prime exercises on Passport authentication.
Includes MongoDB schema for user/password/role identifiers.
Stores username and password natively, but subjects password
to salting and hashing (via bcrypt) prior to saving in their
database. */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
// Number of salting cycles password will be subjected to:
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  // role: {type: String, required: true}
  // Current roles: 'admin', 'user'
});

// Salt and hash password:
UserSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {

        // Change the password to the hash:
        user.password = hash;
        next();
      });
  });
});

// Compare input password to stored password:
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      callback(err);
    } else {
      callback(null, isMatch);
    }
  });
};

var User = mongoose.model('users', UserSchema);
module.exports = User;

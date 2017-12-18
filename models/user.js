const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  type: Boolean,
  admin: {
    default: false
  }
});

User.plugin(passportLocalMongoose); //passport-local-mongoose generates username and password field

module.exports = mongoose.model('User', User)

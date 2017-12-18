const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

//same as module.exports.local ---> exports is an object and can attach properties like 'local'
exports.local = passport.use(new LocalStrategy(User.authenticate())); //recall passport.use(New JwtStrategy(auth_opts, callback)); also, the passport-local-mongoose plugin adds a method to the User model called 'authenticate'
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

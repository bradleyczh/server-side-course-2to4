const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const FacebookTokenStrategy = require('passport-facebook-token')

const config = require('./config.js');

//same as module.exports.local ---> exports is an object and can attach properties like 'local'
exports.local = passport.use(new LocalStrategy(User.authenticate())); //recall passport.use(New JwtStrategy(auth_opts, callback)); also, the passport-local-mongoose plugin adds a method to the User model called 'authenticate'
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: \n", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
      }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function(req, res, next) {
  if(req.user.admin) {
    return next();
  }
  else {
    err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy(
  {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
      if(err)
        return done(err, false); //internal server error
      else if(!err && user !== null)
        return done(null, user); //existing user
      else {
        user = new User({
          username: profile.displayName,
          facebookId: profile.id,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName
        });
        user.save((err, user) => {
          if(err)
            return done(err, false);
          else
            return done(null, user);
        });
      }
    });
  }
));

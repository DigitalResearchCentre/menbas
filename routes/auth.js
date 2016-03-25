var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , _ = require('lodash')
  , db = require('../db')
;

passport.use(new LocalStrategy(function(username, password, done) {
  db.collection('users').findOne({username: username}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user && user.password === password) {
      return done(null, user);
    } else {
      return done({message: 'Incorrect username or password'});
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  db.collection('users').findOne({username: username}, done);
});

function auth(req, res, next) {
  if (!req.isAuthenticated()) {
    res.send(401);
  } else {
    next();
  }
};

module.exports = {
  auth: auth,
  login: passport.authenticate('local'),
};

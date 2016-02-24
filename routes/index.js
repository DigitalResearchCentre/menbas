var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , _ = require('lodash')
;

var users = {
  testuser1: {
    username: 'testuser1',
    password: 'password',
  },
}

passport.use(new LocalStrategy(function(username, password, done) {
  var user = users[username];
  if (user && user.password === password) {
    user = _.clone(user);
    delete user.password;
    return done(null, user);
  } else {
    return done({message: 'Incorrect username or password'});
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  done(null, users[username]);
});

var auth = function(req, res, next) {
  console.log(req.body);
  if (!req.isAuthenticated()) {
    res.send(401);
  } else {
    next();
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth', auth, function(req, res, next) {
  var user = _.clone(req.user);
  delete user.password;
  res.json(user);
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/auth');
});

module.exports = router;

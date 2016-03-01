var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , _ = require('lodash')
  , fs = require('fs')
  , path = require('path')
  , db = require('../db')
;

passport.use(new LocalStrategy(function(username, password, done) {
  var users = db.collections('users');
  users.findOne({username: username}, function(err, user) {
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
  users.findOne({username: username}, done);
});

var auth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.send(401);
  } else {
    next();
  }
};

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

router.post('/users', auth, function(req, res, next) {
  var data = req.body;
  db.collections('users').insert(req.body, function(err, user) {
    if (err) {
      next(err);
    } else {
      user = _.clone(user);
      delete user.password;
      res.json(user);
    }
  });
});

router.patch('/users/:id', auth, function(req, res, next) {
  var data = req.body
    , id = req.params.id
  ;
  console.log(id);
  console.log(data);
});

module.exports = router;

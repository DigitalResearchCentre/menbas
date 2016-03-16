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

router.post('/uploadCSV', auth, function(req, res, next) {
  var user = req.user
    , file = req.body
  ;
  if (_.isEmpty(user.files)) {
    user.files = [];
  }
  var found = _.find(user.files, function(f) {
    return f.name === file.name;
  });
  if (found) {
    found = _.assign(found, file);
  } else {
    user.files.push(file);
  }
  db.collection('users').updateOne({
    _id: user._id
  }, user, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
});

router.post('/saveConfig', auth, function(req, res, next) {
  var user = req.user
    , chartConfig = req.body
  ;
  if (_.isEmpty(user.configs)) {
    user.configs = [];
  }
  var found = _.find(user.configs, function(f) {
    return f.name === chartConfig.name;
  });
  if (found) {
    found = _.assign(found, chartConfig);
  } else {
    user.configs.push(chartConfig);
  }
  db.collection('users').updateOne({
    _id: user._id
  }, user, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
});

router.post('/update', auth, function(req, res, next) {
  var user = req.user
    , file = req.file
  ;
  var found = _.find(user.files, function(f) {
    return f.name === file.name;
  });
  if (found) {
    _.assign(found, file);
  }
  db.collection('users').updateOne({
    _id: user._id
  }, user, function(err, result) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  });
});
router.post('/users', auth, function(req, res, next) {
  var data = req.body;
  db.collection('users').insert(req.body, function(err, user) {
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
  console.log(data);
});

module.exports = router;

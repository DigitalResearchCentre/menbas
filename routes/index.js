var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , _ = require('lodash')
  , fs = require('fs')
  , path = require('path')
  , db = require('../db')
  , Auth = require('./auth')
  , auth = Auth.auth
;

router.get('/auth', auth, function(req, res, next) {
  res.json(_.pick(req.user, ['username']));
});

router.post('/login', Auth.login, function(req, res) {
  res.redirect('/auth');
});

router.patch('/users/:id', auth, function(req, res, next) {
  var data = req.body
    , id = req.params.id
  ;
  console.log(data);
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

router.post('/removeConfig', auth, function(req, res, next) {
  var user = req.user
    , chartConfig = req.body
  ;
  db.collection('users').updateOne({
    _id: user._id
  }, {
    '$pull': {configs: {file: chartConfig.file, name: chartConfig.name}},
  }, function(err, result) {
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

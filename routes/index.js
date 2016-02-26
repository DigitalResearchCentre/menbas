var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , _ = require('lodash')
  , fs = require('fs')
  , path = require('path')
;


var DB = function(path) {
  var self = this;
  this._path = path;
  this.collections = {};
  fs.readFile(path, 'utf8', function(err, content) {
    if (content) {
      self.collections = JSON.parse(content);
    }
  });
};
DB.prototype.save = function(data, callback) {
  _.assign(this.collections, data);
  fs.writeFile(this._path, JSON.stringify(this.collections), callback);
};

var db = new DB(path.join(__dirname, '..', 'data', 'db.json'));

passport.use(new LocalStrategy(function(username, password, done) {
  var users = db.collections.users
    , user = users[username]
  ;
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
  done(null, db.collections.users[username]);
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
  var data = req.body
    , users = db.collections.users
    , user = users[data.username]
  ;
  _.assign(user, data);
  db.save({
    users: users,
  }, function(err) {
    if (err) {
      next(err);
    } else {
      res.json(user);
    }
  })
});

module.exports = router;

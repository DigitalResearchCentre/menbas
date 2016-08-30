var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , _ = require('lodash')
  , db = require('../db')
  , bson = require('bson')
  , ObjectID = bson.ObjectID
  ,bcrypt = require('bcrypt-nodejs')
;

passport.use(new LocalStrategy(function(username, password, done) {
  db.collection('users').findOne({username: username}, function(err, user) {
    if (err) {
      return done(err);
    }
    //console.log(bcrypt.compareSync(password, user.password));
    //if (user && user.password === password) {
    if (user && bcrypt.compareSync(password, user.password)) {
      return done(null, user);
    } else {
      return done({message: 'Incorrect username or password'});
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.collection('users').aggregate([{
    $match: {_id: ObjectID(id)},
  }, {
    $lookup: {
      from: 'files',
      localField: '_id',
      foreignField: 'user_id',
      as: 'files',
    },
  }, {
    $project: {
      'username': 1,
      'files._id': 1,
      'files.name': 1,
    }
  }], function(err, users) {
    done(err, _.isEmpty(users) ? null : users[0]);
  });
});

function auth(req, res, next) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
  } else {
    next();
  }
};

module.exports = {
  auth: auth,
  login: passport.authenticate('local'),
};

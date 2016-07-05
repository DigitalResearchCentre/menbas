var _ = require('lodash')
  , db = require('../db')
  ,bcrypt = require('bcrypt-nodejs')
;

function createAccount(username, password) {
  db.collection('users').find({
    username: username
  }).toArray(function(err, users) {
    if (users.length === 0) {
      db.collection('users').insertOne({
        username: username, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      }, function(err, user) {
        //console.log(user);
      });
    }
    else {
      db.collection('users').findOneAndUpdate({username: username}, {username: username, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))});
    }
  });
}

module.exports = {
  createAccount: createAccount,
};

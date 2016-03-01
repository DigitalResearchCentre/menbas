var mongodb = require('mongodb')
  , _ = require('lodash')
  , MongoClient = mongodb.MongoClient
  , _db = null
;

var db = {
  connect: function(url, callback) {
    MongoClient.connect(url, function(err, db) {
      _db = db;
      if (_.isFunction(callback)) {
        callback(err);
      }
    });
  },
  close: function(callback) {
    if (_db) {
      _db.close(callback);
    }
  },
  collections: function() {
    return _db.collections.apply(_db, arguments);
  }
};

module.exports = db;



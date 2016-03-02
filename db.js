var mongodb = require('mongodb')
  , _ = require('lodash')
  , MongoClient = mongodb.MongoClient
  , db = null
;

var database = {
  connect: function(url, callback) {
    MongoClient.connect(url, function(err, _db) {
      db = _db;
      if (_.isFunction(callback)) {
        callback(err, db);
      }
    });
  },
  close: function(callback) {
    if (db) {
      db.close(callback);
    }
  },
  collection: function() {
    return db.collection.apply(db, arguments);
  }
};

module.exports = database;



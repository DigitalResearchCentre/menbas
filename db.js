var mongodb = require('mongodb')
  , MongoClient = mongodb.MongoClient
  , db = null
;



'mongodb://localhost:27017/menbas'

module.exports = {
  connect: function(url, callback) {
    MongoClient.connect(url, function(err, db) {
      state.db = db;
      callback(err);
    });
  },
  close: function(callback) {
    if (state.db) {
      state.db.close(callback);
    }
  },
  db: null,
}

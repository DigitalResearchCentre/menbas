var Http = ng.http.Http
  , _ = require('lodash')
;

var APIService = ng.core.Injectable().Class({
  constructor: [Http, function(http){
    var self = this;

    this.http = http;
    this.store = {};
  }],
  get: function(url, options) {
    var opts = this.prepareOptions(options);
    return this.http.get(url, opts);
  },
  patch: function(url, data, options) {
    var opts = this.prepareOptions(options);
    return this.http.patch(url, JSON.stringify(data), opts);
  },
  post: function(url, data, options) {
    var opts = this.prepareOptions(options);
    return this.http.post(url, JSON.stringify(data), opts);
  },
  save: function(user) {
    var options = this.prepareOptions({});
    return this.http.post('/users', JSON.stringify(user), options);
  },
  prepareOptions: function(options) {
    options = _.clone(options || {});
    options.headers = _.assign({
      'Content-Type': 'application/json'
    }, options.headers);
    return options;
  },
  auth: function() {
    var store = this.store;
    this.get('/auth').subscribe(function(res) {
      store.authUser = res.json();
    }, function(err) {
      store.authUser = null;
    });
  },
  login: function(username, password) {
    var store = this.store;
    return this.post('/login', {
      username: username,
      password: password,
    }).map(function(res) {
      return res.json();
    }).do(function(user) {
      store.authUser = user;
    }, function(err) {
      store.authUser = null;
    }).subscribe();
  },
});

module.exports = APIService;


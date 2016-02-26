var Http = ng.http.Http;

var AuthService = ng.core.Injectable().Class({
  constructor: [Http, function(http){
    var self = this;

    this.http = http;
    this.http.get('/auth').subscribe(function(res) {
      self.authUser = res.json();
    }, function(err) {
      self.authUser = null;
      console.log(err);
    });
  }],
  login: function(username, password, callback) {
    var options = this.prepareOptions({})
      , self = this
    ;
    this.http.post('/login', JSON.stringify({
      username: username,
      password: password,
    }), options).subscribe(function(res) {
      var user = res.json();
      self.authUser = user;
      callback(user);
    }, function(err) {
      self.authUser = null;
      callback(null);
    });
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
});

module.exports = AuthService;


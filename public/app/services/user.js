var Http = ng.http.Http;

var UserService = ng.core.Injectable().Class({
  constructor: [Http, function(http){
    var self = this;

    this.http = http;
  }],
  patch: function(id, data, options) {
    var opts = this.prepareOptions(options);
    this.http.patch('/users/' + id, JSON.stringify(data), opts);
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


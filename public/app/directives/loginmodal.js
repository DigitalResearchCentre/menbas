var EventEmitter = ng.core.EventEmitter
  , API = require('../services/api')
;

var LoginModal = ng.core.Component({
  selector: 'x-login-modal',
  templateUrl: '/app/directives/loginmodal.html',
  directives: [
    require('./modal').MODAL_DIRECTIVES,
  ],
}).Class({
  constructor: [API, function(api) {
    this.api = api;
  }],
  onLoginClick: function() {
    this.api.login(this.username, this.password);
  },
});

module.exports = LoginModal;




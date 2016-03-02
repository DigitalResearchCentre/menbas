var EventEmitter = ng.core.EventEmitter
  , Actions = require('../actions')
;

var LoginModal = ng.core.Component({
  selector: 'x-login-modal',
  templateUrl: '/app/directives/loginmodal.html',
  directives: [
    require('./modal').MODAL_DIRECTIVES,
  ],
}).Class({
  constructor: [Actions, function(actions) {
    this.actions = actions;
  }],
  onLoginClick: function() {
    this.actions.dispatch(this.actions.login(this.username, this.password));
  },
});

module.exports = LoginModal;




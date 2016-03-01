var EventEmitter = ng.core.EventEmitter;

var LoginModal = ng.core.Component({
  selector: 'x-login-modal',
  templateUrl: '/app/directives/loginmodal.html',
  directives: [
    require('./modal').MODAL_DIRECTIVES,
  ],
  outputs: [
    'login'
  ]
}).Class({
  constructor: [function() {
    this.login = new EventEmitter();
  }],
  onLoginClick: function() {
    this.login.emit({
      type: 'login',
      payload: {
        username: this.username,
        password: this.password,
      },
    });
  },
});

module.exports = LoginModal;




var EventEmitter = ng.core.EventEmitter;

var UploadCSVModal = ng.core.Component({
  selector: 'x-upload-csv-modal',
  templateUrl: '/app/directives/uploadcsvmodal.html',
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

module.exports = UploadCSVModal;




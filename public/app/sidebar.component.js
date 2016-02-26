var AuthService = require('./services/auth')
  , EventEmitter = ng.core.EventEmitter
;

var SidebarComponent = ng.core.Component({
  selector: 'x-sidebar',
  templateUrl: '/app/sidebar.html',
  directives: [
    require('./directives/modal').MODAL_DIRECTIVES,
  ],
  outputs: [
    'select',
  ]
}).Class({
  constructor: [AuthService, function(authService) {

    this.authService = authService;
    this.select = new EventEmitter();
  }],
  onClick: function(evt, file) {
    evt.preventDefault();
    this.file = file;
    this.select.emit(file);
  },
  edit: function(modal, file) {
    this.$modal = modal;
    this.energies = _.map(file.energies, function(e) {
      return e;
    });
    console.log(this.energies);
    modal.open();
  }
});

module.exports = SidebarComponent;



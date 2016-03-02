var APIService = require('./services/api')
  , EventEmitter = ng.core.EventEmitter
;

var SidebarComponent = ng.core.Component({
  selector: 'x-sidebar',
  templateUrl: '/app/sidebar.html',
  directives: [
    require('./directives/modal').MODAL_DIRECTIVES,
  ],
  outputs: [
    'files', 'select',
  ]
}).Class({
  constructor: [APIService, function(api) {

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



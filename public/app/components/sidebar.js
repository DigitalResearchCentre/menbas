var API = require('../services/api');

var SidebarComponent = ng.core.Component({
  selector: 'x-sidebar',
  templateUrl: '/app/components/sidebar.html',
  directives: [
    require('../directives/modal').MODAL_DIRECTIVES,
  ],
  inputs: [
    'files', 'selectedFile',
  ],
}).Class({
  constructor: [API, function(api) {
    this.api = api;
  }],
  onSelect: function(file) {
    var actions = this.actions;
    actions.dispatch(actions.selectFile(file));
  },
  onEdit: function(file) {
    var actions = this.actions;
    this.onSelect(file);
    actions.dispatch(actions.showEditCSVModal(true));
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



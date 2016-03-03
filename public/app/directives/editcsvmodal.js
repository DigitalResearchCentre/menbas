var Actions = require('../actions');

var EditCSVModal = ng.core.Component({
  selector: 'x-edit-csv-modal',
  templateUrl: '/app/directives/editcsvmodal.html',
  directives: [
    require('./modal').MODAL_DIRECTIVES,
  ],
}).Class({
  constructor: [Actions, function(actions) {
    this.actions = actions;
  }],
  filechange: function(event) {
    this.file = event;
  },
  onHide: function() {
    var actions = this.actions;
    actions.dispatch(actions.showUploadCSVModal(false));
  },
  onUpload: function() {
    var actions = this.actions;
    actions.dispatch(actions.uploadCSV(this.file));
  },
});

module.exports = EditCSVModal;




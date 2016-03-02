var Actions = require('../actions');

var UploadCSVModal = ng.core.Component({
  selector: 'x-upload-csv-modal',
  templateUrl: '/app/directives/uploadcsvmodal.html',
  directives: [
    require('./modal').MODAL_DIRECTIVES,
    require('./filereader'),
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

module.exports = UploadCSVModal;




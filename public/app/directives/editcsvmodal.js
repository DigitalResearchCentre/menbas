var API = require('../services/api');

var EditCSVModal = ng.core.Component({
  selector: 'x-edit-csv-modal',
  templateUrl: '/app/directives/editcsvmodal.html',
  directives: [
    require('./modal').MODAL_DIRECTIVES,
  ],
}).Class({
  constructor: [API, function(api) {
    this.api = api;
  }],
  filechange: function(event) {
    this.file = event;
  },
  onHide: function() {
    this.api.showUploadCSVModal(false);
  },
  onUpload: function() {
    this.api.uploadCSV(this.file);
  },
});

module.exports = EditCSVModal;




var API = require('../services/api');

var UploadCSVModal = ng.core.Component({
  selector: 'x-upload-csv-modal',
  templateUrl: '/app/directives/uploadcsvmodal.html',
  directives: [
    require('./modal').MODAL_DIRECTIVES,
    require('./filereader'),
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

module.exports = UploadCSVModal;




var csv = require('csv')
  , AuthService = require('./services/auth')
  , _ = require('lodash')
;

window.csv = csv

var HeaderComponent = ng.core.Component({
  selector: 'x-header',
  templateUrl: '/app/header.html',
  directives: [
    require('./directives/modal').MODAL_DIRECTIVES,
    require('./directives/filereader'),
  ],
}).Class({
  constructor: [AuthService, function(authService) {

    this.authService = authService;
      console.log(this.authService.authUser);
  }],
  onSave: function() {
    var self = this;
    console.log(this);
    this.authService.login(this.username, this.password, function(user) {
      self.$modal.close();
    });
  },
  openModal: function(modal, modalId) {
    this.modalId = modalId;
    modal.open();
    this.$modal = $modal;
  },
  filechange: function(filecontent) {
    this.filecontent = filecontent;
    var data = {};
    csv.parse(filecontent, function(err, rows) {
      var headers = rows.slice(0, 3);
      _.each(rows.slice(3), function(row) {
        var energy = row[0];
        if (energy) {
          data[energy] = {
            abbreviation: row[1],
            unit: row[2],
          }
          _.each(row.slice(3), function(cell, i) {
            var col = i + 3;
            var tmp = {
              country: headers[0][col],
              location: headers[1][col],
              year: headers[3][col],
            }
          });
        } 
        _.each(row, function(cell) {
          
        });
      });
    });
  }
});

module.exports = HeaderComponent;



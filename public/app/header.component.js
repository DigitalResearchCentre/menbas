var csv = require('csv')
  , AuthService = require('./services/auth')
  , _ = require('lodash')
;

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
    this.authService.login('testuser', 'pass', function(user) {
    });
  }],
  onSignIn: function() {
    var self = this;
    console.log(this);
    this.authService.login(this.username, this.password, function(user) {
      self.$modal.close();
      console.log(self.authService);
    });
  },
  onUpload: function() {
    var user = this.authService.authUser
      , self = this
      , file = this.file
    ;
    if (file) {
      if (!user.files) {
        user.files = [];
      }
      _.assign(file, {
        charts: {
          width: 960,
          height: 640,
          all: "",
          EROI: "FP / TIC",
        },
        places: {},
        energies: {},
        _energies: {},
      });
      csv.parse(file.content, function(err, rows) {
        var headers = rows.slice(0, 3);
        _.each(rows.slice(3), function(row) {
          var energy = row[0];
          if (energy && row[1]) {
            file._energies[energy] = {
              abbreviation: row[1],
              unit: row[2],
            };
            if (row[1]) {
              file.energies[row[1]] = energy;
            }
            _.each(row.slice(3), function(cell, i) {
              var col = i + 3
                , country = headers[0][col]
                , place = headers[1][col]
                , year = headers[2][col]
              ;
              if (!file.places[place]) {
                file.places[place] = {};
              }
              if (!file.places[place][energy]) {
                file.places[place][energy] = [];
              }
              file.places[place][energy].push([year, cell]);
            });
          } 
        });

        user.files.push(file);
        self.authService.save(user).subscribe(function(res) {
          console.log(res.json());
          self.$modal.close();
        });
      });

    }
  },
  openModal: function(modal, modalId) {
    this.modalId = modalId;
    modal.open();
    this.$modal = modal;
  },
  filechange: function(file) {
    this.file = file;
  }
});

module.exports = HeaderComponent;




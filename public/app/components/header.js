import React, { PropTypes } from 'react';

const Header = ({onClick}) => (
  <div>
    <div class="left">
      <div class="item" onClick="onClick">
        Upload CSV
      </div>
    </div>
    <div class="right">
      <div class="item">
        {user.username}
      </div>
    </div>
  </div>
);

Header.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Header;

    /*
var HeaderComponent = ng.core.Component({
  selector: 'x-header',
  templateUrl: '/app/components/header.html',
  directives: [
  ],
  inputs: ['user']
}).Class({
  constructor: [API, function(api) {
    this.api = api;
  }],
  ngOnInit: function() {
    console.log(this.user);
    
  },
  onUploadCSVClick: function() {
    this.api.showUploadCSVModal(true);
    var user = this.state.user
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
              abbr: row[1],
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
});

module.exports = HeaderComponent;
      */




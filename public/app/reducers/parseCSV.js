import csv from 'csv';

export default function parseCSV(file) {
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
  return csv.parse(file.content, function(err, rows) {
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
  });
}

var _ = require('lodash')
  , ReduxActions = require('redux-actions')
  , createAction = ReduxActions.createAction
;
import $ from 'jquery';
import csv from 'csv';


const keys = [
  'auth', 'uploadCSV', 'selectFile', 'editFile',
  'showEditCSVModal', 'showUploadCSVModal',  'updateFormula'
];

export const Types = _.zipObject(keys, keys);

const Actions = _.mapValues(Types, function(value, key) {
  return createAction(value);
});

const _uploadCSV = Actions.uploadCSV;
const _selectFile = Actions.selectFile;
const _updateFormula = Actions.updateFormula;


function parseCSV(file, callback) {
  let result = _.assign({
    charts: {
      width: 960,
      height: 640,
      all: "",
      EROI: "FP / TIC",
    },
    places: {},
    energies: {},
    _energies: {},
  }, file);
  return csv.parse(file.content, function(err, rows) {
    var headers = rows.slice(0, 3);
    _.each(rows.slice(3), function(row) {
      var energy = row[0];
      if (energy && row[1]) {
        result._energies[energy] = {
          abbr: row[1],
          unit: row[2],
        };
        if (row[1]) {
          result.energies[row[1]] = energy;
        }
        _.each(row.slice(3), function(cell, i) {
          var col = i + 3
            , country = headers[0][col]
            , place = headers[1][col]
            , year = headers[2][col]
          ;
          if (!result.places[place]) {
            result.places[place] = {};
          }
          if (!result.places[place][energy]) {
            result.places[place][energy] = [];
          }
          result.places[place][energy].push([year, cell]);
        });
      } 
    });
    callback(result);
  });
}

_.assign(Actions, {
  checkAuth: function() {
    return function(dispatch, getState) {
      return $.get('/auth')
        .done(user => dispatch(Actions.auth(user)))
        .fail(function(err) {
          dispatch(Actions.auth(new Error(err)));
        });
        ;
    }
  },
  login: function(username, password) {
    return function(dispatch, getState) {
      let p = $.post('/login', { 
        username: username,
        password: password,
      });
      return p
        .done(function(user) {
          dispatch(Actions.checkAuth(user));
        })
        .fail(function(err) {
          dispatch(Actions.auth(new Error(err)));
        });
    };
  },
  uploadCSV: function(file) {
    return function(dispatch, getState) {
      dispatch(Actions.showUploadCSVModal(false));
      return $.post('/uploadCSV', file)
        .done(function(user) {
          dispatch(Actions.auth(user));
        })
        .fail(function(err) {
          dispatch(_uploadCSV(new Error(err)));
        });
    };
  },
  selectFile: function(file) {
    return function(dispatch) {
      return new Promise((resolve, reject) => {
        parseCSV(file, function(result) {
          dispatch(_selectFile(result));
          resolve(result);
        });
      });
    }
  },
  updateFormula: function(file) {
    return _updateFormula(file);
    /*
    return function(dispatch, getState) {
      dispatch();
      return $.post('/update', );
    }*/
  }
});

export default Actions;


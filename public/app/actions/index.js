var _ = require('lodash')
  , ReduxActions = require('redux-actions')
  , createAction = ReduxActions.createAction
;
import $ from 'jquery';
import csv from 'csv';


const keys = [
  'auth', 'uploadCSV', 'selectConfig', 'editFile',
  'showEditCSVModal', 'showUploadCSVModal',  'updateFormula',
  'saveConfig',
];

export const Types = _.zipObject(keys, keys);

const Actions = _.mapValues(Types, function(value, key) {
  return createAction(value);
});

function parseCSV(content, callback) {
  return csv.parse(content, function(err, rows) {
    let headers = rows.slice(0, 3)
      , results = []
    ;
    _.each(rows.slice(3), function(row) {
      let [energy, abbr, unit, ...values] = row;

      _.each(values, function(value, i) {
        value = _.trim(value);
        if (value !== '') {
          results.push({
            energy,
            abbr,
            unit,
            value: parseFloat(value.replace(/,/g, '')),
            country: headers[0][i + 3],
            place: headers[1][i + 3],
            year: parseInt(headers[2][i + 3]),
          });
        }
      });
    });
    callback(results);
  });
}



export default _.assign({}, Actions, {
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
          dispatch(Actions.uploadCSV(new Error(err)));
        });
    };
  },
  selectConfig: function(chartConfig) {
    return function(dispatch, getState) {
      let state = getState();
      return new Promise((resolve, reject) => {
        let file = _.find(state.files, {name: chartConfig.file});
        parseCSV(file.content, function(results) {
          dispatch(Actions.selectConfig({
            config: chartConfig, 
            data: results,
          }));
          resolve();
        });
      });
    }
  },
  saveConfig: function(chartConfig) {
    return function(dispatch, getState) {
      return $.post('/saveConfig', chartConfig)
        .done(function(user) {
          dispatch(Actions.auth(user));
        })
        .fail(function(err) {
          dispatch(Actions.saveConfig(new Error(err)));
        });
    }
  },

  updateFormula: function(file) {
    return Actions.updateFormula(file);
    /*
    return function(dispatch, getState) {
      dispatch();
      return $.post('/update', );
    }*/
  }
});


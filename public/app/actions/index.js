var _ = require('lodash')
  , ReduxActions = require('redux-actions')
  , createAction = ReduxActions.createAction
;
import $ from 'jquery';
import csv from 'csv';


const keys = [
  'auth', 'uploadCSV', 'selectConfig', 'selectItem', 'editFile',
  'showEditCSVModal', 'showUploadCSVModal',  'updateFormula',
  'saveConfig', 'removeConfig',
];

export const Types = _.zipObject(keys, keys);

const Actions = _.mapValues(Types, function(value, key) {
  return createAction(value);
});

function parseCSV(content, callback) {
  return csv.parse(content, function(err, rows) {
    let headers = rows.slice(0, 3)
      , results = []
      , places = {}
      , years = {}
      , abbrs = {}
    ;
    _.each(rows.slice(3), function(row) {
      let [energy, abbr, unit, ...values] = row;
      if (!!abbr) {
        _.each(values, function(value, i) {
          value = _.trim(value);
          if (value !== '') {
            let obj = {
              energy: energy,
              abbr: abbr,
              unit: unit,
              value: parseFloat(value.replace(/,/g, '')),
              country: headers[0][i + 3],
              place: headers[1][i + 3],
              year: parseInt(headers[2][i + 3]),
            };
            if (!places[obj.place]) {
              places[obj.place] = [];
            }
            places[obj.place].push(obj);
            if (!years[obj.year]) {
              years[obj.year] = [];
            }
            years[obj.year].push(obj);
            if (!abbrs[obj.abbr]) {
              abbrs[obj.abbr] = [];
            }
            abbrs[obj.abbr].push(obj);
            results.push(obj);
          }
        });
      }
    });
    callback({
      places: places,
      years: years,
      abbrs: abbrs,
      objects: results,
    });
  });
}

function selectItem(dispatch, item) {
  return new Promise((resolve, reject) => {
    if (!item.data) {
      parseCSV(item.file.content, function(result) {
        dispatch(Actions.selectItem(result));
        resolve(result);
      });
    } else {
      dispatch(Actions.selectItem(item.data));
      resolve(item.data);
    }
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
          dispatch(Actions.auth(user));
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
  selectItem: function(item) {
    return function(dispatch, getState) {
      return selectItem(dispatch, item);
    };
  },
  selectConfig: function(chartConfig) {
    return function(dispatch, getState) {
      let state = getState()
        , file = _.get(state, 'selectedFile.file', {})
      ;
      if (file.name === chartConfig.file && file.data) {
        return dispatch(Actions.selectConfig({
          config: chartConfig, 
          data: file.data,
        }));
      } else {
        let action = selectItem(dispatch, {
          file: _.find(state.files, {name: chartConfig.file})
        });
        action.then((data) => {
          return dispatch(Actions.selectConfig({
            config: chartConfig, 
            data: data,
          }));
        });
        return dispatch(function(dispatch) {
          return action;
        });
      }
    };
  },
  saveConfig: function(chartConfig) {
    return function(dispatch, getState) {
      return $.ajax({
        type: 'POST',
        url: '/saveConfig',
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(chartConfig),
        dataType: 'json'
      })
        .done(function(user) {
          dispatch(Actions.auth(user));
          dispatch(Actions.selectConfig({
            config: chartConfig, 
            data: getState().selectedConfig.data,
          }));
        })
        .fail(function(err) {
          dispatch(Actions.saveConfig(new Error(err)));
        });
    }
  },
  removeConfig: function(chartConfig) {
    return function(dispatch, getState) {
      return $.ajax({
        type: 'POST',
        url: '/removeConfig',
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(chartConfig),
        dataType: 'json'
      })
        .done(function(user) {
          dispatch(Actions.auth(user));
          dispatch(Actions.showEditCSVModal(false));
          dispatch(Actions.selectConfig({
            config: null, 
            data: null,
          }));
        })
        .fail(function(err) {
          dispatch(Actions.removeConfig(new Error(err)));
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


import _ from 'lodash';
import update from 'react-addons-update';
import ReduxActions, { createAction }  from 'redux-actions';
import $ from 'jquery';
import csv from 'csv';


const keys = [
  'auth', 'uploadCSV', 'selectConfig', 'selectFile', 'editFile',
  'showEditCSVModal', 'showUploadCSVModal',  'updateFormula',
  'saveConfig', 'removeConfig',
];

export const Types = _.zipObject(keys, keys);

const BaseActions = _.mapValues(Types, function(value, key) {
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

const Actions = _.assign({}, BaseActions, {
  // set auth user for app
  auth: function(user) {
    return function(dispatch, getState) {
      const state = getState();
      if (!_.isEqual(state.user, user)) {
        return dispatch(BaseActions.auth(user));
      }
    }
  },
  // check if user is already authenticated
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
      dispatch(BaseActions.showUploadCSVModal(false));
      return $.post('/files', _.omit(file, 'fetched'))
        .done(function(result) {
          dispatch(BaseActions.uploadCSV(result));
        })
        .fail(function(err) {
          dispatch(BaseActions.uploadCSV(new Error(err)));
        });
    };
  },
  selectFile: function(file) {
    return function(dispatch, getState) {
      return new Promise((resolve, reject) => {
        if (!file.fetched) {
          return $.get('/files/' + file._id)
            .then(function(f) {
              dispatch(Actions.selectFile({
                ...f,
                fetched: true,
              })).then(resolve);
            })
            .fail(function(err) {
              dispatch(BaseActions.selectFile(new Error(err)));
              resolve(err);
            });
        } else {
          if (!file.data) {
            parseCSV(file.content, function(result) {
              const newFile = {
                ...file,
                data: result,
              };
              dispatch(BaseActions.selectFile(newFile));
              resolve(newFile);
            });
          } else {
            dispatch(BaseActions.selectFile(file));
            resolve(file);
          }
        }
      });
    };
  },
  selectConfig: function(chartConfig) {
    return function(dispatch, getState) {
      let state = getState()
        , file = _.get(state, 'selectedFile.file', {})
      ;
      if (file.name === chartConfig.file && file.data) {
        return dispatch(BaseActions.selectConfig({
          config: chartConfig, 
          data: file.data,
        }));
      } else {
        file = _.find(state.files, {name: chartConfig.file});
        let action = Actions.selectFile(file); 
        dispatch(action).then((f) => {
          return dispatch(BaseActions.selectConfig({
            config: chartConfig, 
            data: f.data,
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
      const state = getState();
      let file = state.selectedFile;
      if (!file.configs) {
        file.configs = [];
      }
      const index = _.findIndex(file.configs, function(c) {
        return c.name === chartConfig.name;
      });
      if (index === -1) {
        file = update(file, {
          configs: {$push: [chartConfig]}
        });
      } else {
        file = update(file, {
          configs: {[index]: {$set: chartConfig}},
        });
      }
      return $.ajax({
        type: 'POST',
        url: '/files',
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(_.pick(file, [
          '_id', 'name', 'user_id', 'configs', 'content',
        ])),
        dataType: 'json'
      })
        .done(function(result) {
          dispatch(BaseActions.saveConfig(result));
        })
        .fail(function(err) {
          dispatch(BaseActions.saveConfig(new Error(err)));
        });
    }
  },
  removeConfig: function(chartConfig) {
    return function(dispatch, getState) {
      dispatch(BaseActions.removeConfig(chartConfig));
      return $.ajax({
        type: 'POST',
        url: '/removeConfig',
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(chartConfig),
        dataType: 'json'
      })
        .done(function() {
          dispatch(BaseActions.showEditCSVModal(false));
          dispatch(BaseActions.selectConfig({
            config: null, 
            data: null,
          }));
        })
        .fail(function(err) {
          dispatch(BaseActions.removeConfig(new Error(err)));
        });
    }
  },

  updateFormula: function(file) {
    return BaseActions.updateFormula(file);
    /*
    return function(dispatch, getState) {
      dispatch();
      return $.post('/update', );
    }*/
  }
});

export default Actions;

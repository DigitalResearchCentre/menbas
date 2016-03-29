import update from 'react-addons-update';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import { Types } from '../actions';
import initialState from '../initialState';
import config from '../config';

function createReducer(reducers, errorReducers, defaultState={}) {
  return function(state=defaultState, action) {
    let _reducers = action.error ? errorReducers : reducers;
    if (_reducers.hasOwnProperty(action.type)) {
      return _reducers[action.type](state, action);
    } else {
      return state;
    }
  };
}

function reduceReducer(reducers) {
  return function(state, action) {
    return _.reduce(reducers, function(_state, reducer) {
      return reducer(_state, action);
    }, state);
  };
}

const rootReducers = {
  [Types.auth]: function(state, action) {
    var user = action.payload;
    return {
      ...state,
      user: user,
      files: user.files || [],
    };
  },
  [Types.selectFile]: function(state, action) {
    const file = action.payload;
    const index = _.findIndex(state.files, (f)=> f._id === file._id);
    return update(state, {
      files: {[index]: {$set: file}},
      selectedFile: {$set: action.payload},
      configs: {$set: file.configs || []},
    });
  },
  [Types.uploadCSV]: function(state, action) {
    const file = action.payload.value;
    const index = _.findIndex(state.files, (f)=> f._id === file._id);
    if (index === -1) {
      return update(state, {
        files: {$push: [file]},
      });
    } else {
      return update(state, {
        files: {[index]: {$set: file}},
      });
    }
  },
  [Types.saveConfig]: function(state, action) {
    const file = action.payload.value;
    const index = _.findIndex(state.files, (f)=> f._id === file._id);
    if (index === -1) {
      return state;
    } else {
      return update(state, {
        files: {[index]: {$set: file}},
        selectedFile: {
          $set: {
            ...state.selectedFile,
            file,
          }
        },
      });
    }
  },
  [Types.removeConfig]: function(state, action) {
    const payload = action.payload;
    return {
      ...state,
      configs: _.filter(state.configs, function(config) {
        return config.name !== payload.name || config.file !== payload.file;
      }),
    };
  },
  [Types.selectConfig]: function(state, action) {
    let {
      config,
      data,
    } = action.payload;
    let {
      type, places, years, abbrs, xAxis, 
      formulas = '',
    } = config || {};
    let objects = (data || {}).objects;

    _.each(_.groupBy(objects, function(obj) {
      return `${obj.place} ${obj.year}`;
    }), function(objs, key) {
      objs = _.groupBy(objs, 'abbr');

      let script = _.map(objs, function(d, abbr) {
        return `var ${abbr} = ${d[0].value};`;
      }).join('');

      _.each(formulas.split(';'), function(cmd) {
        if (_.trim(cmd) === '') return;
        let [variable, formula] = cmd.split('=');
        try {
          let v = eval(`${script} ${formula};`);
          script += `var ${variable} = ${v};`;
          let d = {
            abbr: _.trim(variable),
            value: v,
            place: objs['POP'][0].place,
            year: objs['POP'][0].year,
          };
          objects.push(d);
        } catch (e) {
          rootErrorReducer(state, {
            ...action,
            payload: e,
            error: true,
          });
        }
      });
    });

    return {
      ...state,
      selectedConfig: {
        config: {
          ..._.defaults({}, action.payload.config, {
            places: [],
            years: [],
            abbrs: [],
            formulas: '',
          }),
        },
        data: {
          ...data,
          objects: objects,
        },
      }, 
    };
  },
  [Types.updateFormula]: function(state, action) {
    console.log('TODO: updateFormula');
    return state;

    let _energies = _.get(state, 'selectedFile._energies', {});
    let energies = _.get(state, 'selectedFile.energies', {});
    let abbr = action.payload.abbr;
    let energy = _energies[energies[abbr]];
    _energies = _.assign({}, _energies, {
      [energies[abbr]]: _.assign({}, energy, action.payload) 
    });
    
    return {
      ...state,
      selectedFile: {
        ...state.selectedFile,
        _energies: _energies
      },
    };
  },
  [Types.showUploadCSVModal]: function(state, action) {
    return {
      ...state,
      showUploadCSVModal: action.payload,
    };
  },
  [Types.showEditCSVModal]: function(state, action) {
    return {
      ...state,
      showEditCSVModal: action.payload,
    };
  },
};

const errorReducers = {};

function rootErrorReducer(state, action) {
  if (action.error && config.DEBUG) {
    console.log(action);
  }
  return state;
}

export default reduceReducer([
  rootErrorReducer,
  createReducer(rootReducers, errorReducers, initialState),
]);




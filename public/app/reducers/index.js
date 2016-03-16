import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import { Types } from '../actions';
import initialState from '../initialState';
import parseCSV from './parseCSV';
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
      configs: user.configs || [],
    };
  },
  [Types.saveConfig]: function(state, action) {
    console.log(action);
    return state;
  },
  [Types.selectConfig]: function(state, action) {
    let {
      config: {
        type, place, year, energy, xAxis, formulas,
      },
      data,
    } = action.payload;

    data = _.filter(data, function(d) {
      return (
        (_.isEmpty(place) || place.indexOf(d.place) !== -1) && 
        (_.isEmpty(energy) || energy.indexOf(d.abbr) !== -1) &&
        (_.findIndex(year, function(range) {
          return range.length === 2 
            ? range[0] <= d.year && d.year <= range[1]
            : range[0] === d.year
        })) !== -1
      );
    });
    return {
      ...state,
      selectedConfig: {
        ...action.payload,
        data,
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

export default reduceReducer([
  function(state, action) {
    if (action.error && config.DEBUG) {
      console.log(action.error);
    }
    return state;
  },
  createReducer(rootReducers, errorReducers, initialState),
]);





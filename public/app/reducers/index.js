import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import Immutable from '../utils/immutable';
import Im from 'immutable';
import { Types } from '../actions';
import initialState from '../initialState';
import parseCSV from './parseCSV';
import config from '../config';

window.Immutable = Immutable;

function test(aa) {
  console.log(aa);
  console.log(Immutable.Map);
  console.log(Immutable.Map({a: 1, b: 2, c: 3}));
  console.log(Immutable.Map({a: 1, b: 2, c: 3}).pick('a', 'c').toObject());;
 
}

test(123);

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
    return state.merge(state, {
      user: user,
      files: user.files || [],
    });
  },
  [Types.selectFile]: function(state, action) {
    return state.merge(state, {
      selectedFile: action.payload,
    });
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
    
    return _.assign({}, state, {
      selectedFile: _.assign({}, state.selectedFile, {
        _energies: _energies
      }),
    });
  },
  [Types.showUploadCSVModal]: function(state, action) {
    return state.merge(state, {
      showUploadCSVModal: action.payload,
    });
  },
  [Types.showEditCSVModal]: function(state, action) {
    return state.merge(state, {
      showEditCSVModal: action.payload,
    });
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





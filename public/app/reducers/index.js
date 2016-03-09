import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import { Types } from '../actions';
import parseCSV from './parseCSV';

function createReducer(reducers) {
  return function(state={}, action) {
    let _reducers = reducers;
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

var globalHandlers = {
  [Types.auth]: function(state, action) {
    var user = action.payload;
    if (action.error) {
      console.log(action.payload);
      return state;
    } else {
      return _.assign({}, state, {
        user: user,
        files: user.files || [],
      });
    }
  },
  [Types.uploadCSV]: function(state, action) {
    return state;
  },
  [Types.selectFile]: function(state, action) {
    parseCSV(action.payload);
    return _.assign({}, state, {
      selectedFile: action.payload,
    });
  },
};

var uiHandlers  = {
  [Types.showUploadCSVModal]: function(state, action) {
    return _.assign({}, state, {
      showUploadCSVModal: action.payload,
    });
  },
  [Types.showEditCSVModal]: function(state, action) {
    return _.assign({}, state, {
      showEditCSVModal: true,
    });
  },
};



module.exports = reduceReducer([
  createReducer(globalHandlers),
  combineReducers({
    files: createReducer({}),
    selectedFile: createReducer({}),
    user: createReducer({}),
    ui: createReducer(uiHandlers),
  }),
]);





var redux = require('redux')
  , _ = require('lodash')
  , Actions = require('../actions')
  , Types = Actions.Types
;

function createReducer(handlers) {
  return function reducer(state, action) {
    state = state || {};
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

var authHandlers = {};
authHandlers[Types.auth] = function(state, action) {
  var nextState = {};
  if (action.error) {
    nextState.user = null;
  } else {
    nextState.user = action.payload.user;
  }
  return _.assign({}, state, nextState);
};
authHandlers[Types.uploadCSV] = function(state, action) {
  console.log(state);
  console.log(action);
  return state;
};

var uiHandlers = {};
uiHandlers[Types.showUploadCSVModal] = function(state, action) {
  return _.assign({}, state, {showUploadCSVModal: action.payload});
};

module.exports = redux.combineReducers({ 
  auth: createReducer(authHandlers),
  ui: createReducer(uiHandlers),
});

var redux = require('redux')
  , _ = require('lodash')
  , Types = require('../actions').Types
;

function createReducer(handlers, defaultState) {
  if (defaultState === void(0)) {
    defaultState = {};
  }
  return function(state, action) {
    if (state === void(0)) {
      state = defaultState;
    }
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
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

var globalHandlers = _.mapKeys({
  auth: function(state, action) {
    var user = null;
    if (!action.error) {
      user = action.payload.user;
    }
    return _.assign({}, state, {
      user: user,
      files: user.files || [],
    });
  },
  uploadCSV: function(state, action) {
    return state;
  },
  selectFile: function(state, action) {
    return _.assign({}, state, {
      selectedFile: action.payload.file,
    });
  },
}, function(reducer, key) {
  return Types[key];
});

var uiHandlers  = _.mapKeys({
  showUploadCSVModal: function(state, action) {
    return _.assign({}, state, {
      showUploadCSVModal: action.payload.show,
    });
  },
  showEditCSVModal: function(state, action) {
    return _.assign({}, state, {
      showEditCSVModal: true,
    });
  }
}, function(reducer, key) {
  return Types[key];
});


module.exports = reduceReducer([
  createReducer(globalHandlers),
  redux.combineReducers({
    files: createReducer({}, []),
    selectedFile: createReducer({}, null),
    user: createReducer({}, null),
    ui: createReducer(uiHandlers),
  }),
]);





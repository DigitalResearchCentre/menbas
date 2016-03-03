var _ = require('lodash')
  , APIService = require('../services/api')
;

function handleError(err, type) {
  return {
    type: type,
    payload: err,
    error: true,
  };
}

var Types = {
  auth: 'auth',
  showUploadCSVModal: 'show-upload-csv-modal',
  uploadCSV: 'upload-csv',
  selectFile: 'select-file',
  showEditCSVModal: 'show-edit-csv-modal',
};

var Actions = ng.core.Injectable().Class({
  constructor: [new ng.core.Inject('Store'), APIService, function(store, api) {
    this.store = store;
    this.api = api;
  }],
  dispatch: function(action) {
    this.store.dispatch(action);
  },
  checkAuth: function() {
    var api = this.api;
    return function(dispatch, getState) {
      return api.auth()
        .then(function(user) {
          dispatch({
            type: Types.auth,
            payload: {
              user: user,
            }
          });
        })
        .catch(function(err) {
          dispatch(handleError(err, Types.auth));
        });
    };
  },
  login: function(username, password) {
    var api = this.api;
    return function(dispatch, getState) {
      return api.login(username, password)
        .then(function(user) {
          dispatch({
            type: Types.auth,
            payload: {
              user: user,
            },
          });
        })
        .catch(function(err) {
          dispatch(handleError(err, Types.auth));
        });
    };
  },
  showUploadCSVModal: function(show) {
    return {
      type: Types.showUploadCSVModal,
      payload: {
        show: show,
      },
    };
  },
  showEditCSVModal: function(show) {
    return {
      type: Types.showEditCSVModal,
      payload: {
        show: show,
      },
    };
  },
  selectFile: function(file) {
    return {
      type: Types.selectFile,
      payload: {
        file: file,
      },
    };
  },
  uploadCSV: function(file) {
    var api = this.api;
    return function(dispatch, getState) {
      dispatch({
        type: Types.uploadCSV,
        payload: {
          file: file,
        },
      });
      return api.uploadCSV(file)
        .catch(function(err) {
          dispatch(handleError(err, Types.uploadCSV));
        });
    };
  },
});

Actions.Types = Types;

module.exports = Actions;

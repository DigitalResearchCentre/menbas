var _ = require('lodash')
  , ReduxActions = require('redux-actions')
  , createAction = ReduxActions.createAction
;
import $ from 'jquery';


const keys = [
  'auth', 'uploadCSV', 'selectFile', 'editFile',
  'showEditCSVModal', 'showUploadCSVModal', 
];

export const Types = _.zipObject(keys, keys);

const Actions = _.mapValues(Types, function(value, key) {
  return createAction(value);
});

const _uploadCSV = Actions.uploadCSV;

_.assign(Actions, {
  checkAuth: function() {
    return function(dispatch, getState) {
      window.$p = $.get('/auth');
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
          dispatch(_uploadCSV(user));
        })
        .fail(function(err) {
          dispatch(_uploadCSV(new Error(err)));
        });
    };
  },

});

export default Actions;


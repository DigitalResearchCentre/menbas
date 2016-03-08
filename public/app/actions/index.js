var _ = require('lodash')
  , ReduxActions = require('redux-actions')
  , createAction = ReduxActions.createAction
;

const keys = [
  'auth', 'uploadCSV', 'selectFile',
  'showEditCSVModal', 'showUploadCSVModal', 
];

export const Types = _.zipObject(keys, keys);

const Actions = _.mapValues(Types, function(value, key) {
  return createAction(value);
});

_.assign(Actions, {
  checkAuth: function() {
    return function(dispatch, getState) {
      return fetch('/auth')
        .then(res => res.json())
        .then(json => Actions.auth(json))
        .catch(err => Actions.auth(new Error(err)))
        ;
    }
  },
});

export default Actions;


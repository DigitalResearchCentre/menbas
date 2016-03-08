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

export default Actions;


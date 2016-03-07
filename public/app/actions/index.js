var _ = require('lodash')
  , ReduxActions = require('redux-actions')
  , createAction = ReduxActions.createAction
;


var keys = [
  'auth', 'uploadCSV', 'selectFile', 
  'showEditCSVModal', 'showUploadCSVModal', 
];
var Types = _.zipObject(keys, keys);

var Actions = _.mapValues(Types, function(key) {
  return createAction(key);
});

module.exports = {
  Actions: Actions,
  Types: Types,
};

var redux = require('redux')
  , ReduxActions = require('redux-actions')
  , Http = ng.http.Http
  , API = require('./api')
  , Store = require('./store')
  , createAction = ReduxActions.createAction
;

var api = {};

var AuthService = ng.core.Injectable().Class({
  extends: API,
  constructor: [Http, Store, function(http, store){
    API.call(this, http);
    this.store = store;
    this.actions = redux.bindActionCreators(Actions, store.dispatch);
  }],
});

module.exports = AuthService;


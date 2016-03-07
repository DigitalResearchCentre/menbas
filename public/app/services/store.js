var redux = require('redux')
  , thunk = require('redux-thunk')
  , createStore = redux.createStore
  , compose = redux.compose
  , applyMiddleware = redux.applyMiddleware
;
var _store = createStore(
  require('../reducers'), 
  require('../initialState'), 
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? 
      window.devToolsExtension() : 
      function(f) {return f;}
  )
);

var StoreService = ng.core.Injectable().Class({
  constructor: [function() {
    this.store = _store;
    this.dispatch = _store.dispatch.bind(_store);
  }],
  bindActionCreators: function(actions) {
    return redux.bindActionCreators(actions, this.dispatch);
  },
  subscribe: function(listener) {
    var store = this.store;
    return store.subscribe(function() {
      return listener(store.getState());
    });
  }
});

module.exports = StoreService;





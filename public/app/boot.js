require('script!angular2/bundles/angular2-polyfills');
require('script!rxjs/bundles/Rx.umd');
require('script!angular2/bundles/angular2-all.umd');

require('jquery');
require('bootstrap');
require('./app.less');

var redux = require('redux')
  , thunk = require('redux-thunk')
  , createStore = redux.createStore
  , applyMiddleware = redux.applyMiddleware
  , store = applyMiddleware(thunk)(createStore)()
;

var AppComponent = require('./app.component');

document.addEventListener('DOMContentLoaded', function() {
  ng.platform.browser.bootstrap(AppComponent, [
    ng.http.HTTP_PROVIDERS,
    ng.router.ROUTER_PROVIDERS,
    require('ng2-redux')(store),
    require('./services/api'),
  ]).catch(function(err) {
    console.error(err);
  });
});



require('script!angular2/bundles/angular2-polyfills');
require('script!rxjs/bundles/Rx.umd');
require('script!angular2/bundles/angular2-all.umd');

require('jquery');
require('bootstrap');
require('./components/app.less');



var AppComponent = require('./components/app');

document.addEventListener('DOMContentLoaded', function() {
  ng.platform.browser.bootstrap(AppComponent, [
    ng.http.HTTP_PROVIDERS,
    ng.router.ROUTER_PROVIDERS,
    require('./services/store'),
    require('./services/api'),
    require('./services/auth'),
  ]).catch(function(err) {
    console.error(err);
  });
});

window.API = require('./services/api');





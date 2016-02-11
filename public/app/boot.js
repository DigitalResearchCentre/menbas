require('script!angular2/bundles/angular2-polyfills');
require('script!rxjs/bundles/Rx.umd');
require('script!angular2/bundles/angular2-all.umd');
require('./app.less');

var AppComponent = require('./app.component');

document.addEventListener('DOMContentLoaded', function() {
  ng.platform.browser.bootstrap(AppComponent, [
    ng.http.HTTP_PROVIDERS,
    ng.router.ROUTER_PROVIDERS,
  ]).catch(function(err) {
    console.error(err);
  });
});



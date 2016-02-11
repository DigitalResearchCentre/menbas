'use strict';
var Rx = require('rxjs');

var Dispatcher = function() {

  this.viewer$ = new Rx.Subject();
};

module.exports = new Dispatcher();

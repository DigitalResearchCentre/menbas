var HomeComponent = ng.core.Component({
  selector: 'x-home',
  template: '<x-sidebar></x-sidebar><x-viewer></x-viewer>',
  directives: [
    require('./sidebar.component'),
    require('./viewer.component'),
  ],
}).Class({
  constructor: [function() {
  }],
});

module.exports = HomeComponent;



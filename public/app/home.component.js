var HomeComponent = ng.core.Component({
  selector: 'x-home',
  templateUrl: '/app/home.html',
  directives: [
    require('./sidebar.component'),
    require('./viewer.component'),
  ],
}).Class({
  constructor: [function() {
  }],
  onSelect: function(file) {
    this.file = file;
  }
});

module.exports = HomeComponent;



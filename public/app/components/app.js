var Actions = require('../actions');

var AppComponent = ng.core.Component({
  selector: 'x-app',
  templateUrl: '/app/components/app.html',
  directives: [
    ng.router.ROUTER_DIRECTIVES,
    require('./header'),
    require('./sidebar'),
    require('./viewer'),
    require('../directives/loginmodal'),
    require('../directives/uploadcsvmodal'),
  ],
}).Class({
  constructor: [new ng.core.Inject('Store'), Actions, function(store, actions) {
    this.store = store;

    this.unsubscribe = store.subscribe(this.onStateChange.bind(this));
    this.onStateChange();

    store.dispatch(actions.checkAuth());
  }],
  onStateChange: function() {
    this.state = this.store.getState();
  },
  ngOnDestroy: function() {
    this.unsubscribe();
  }
});

module.exports = AppComponent;


/*
    var a = {
      files: [{
        name: 'energydata_2016_6.csv',
        types: {
          linechart: '../data/linechart1.json',
          energy: '../data/energy.json',
        },
      }, {
        name: 'test.csv',
        types: {
          linechart: '../data/linechart1.json',
          energy: '../data/energy.json',
        },
      }],
    };

d3.xhr('../data/energydata_2016_6.csv').get(function(err, resp) {
  var data = {}
    , places = data.places = {}
    , raw, header, rows, years, cur
  ;
  raw = _.map(resp.responseText.split(/[\n\r]/), function(l) {
    return l.split(',');
  });
  years = raw[2].slice(1);
  rows = raw.splice(4, 15);
  _.each(raw[1].slice(1), function(value, i) {
    if (value) {
      cur = places[value] = {};
      _.each(rows, function(r) {
        cur[r[0]] = [];
      });
    }
    if (cur){
      _.each(rows, function(r) {
        cur[r[0]].push([years[i], r[i+1]]);
      });
    }
  });

});
*/





var AppComponent = ng.core.Component({
  selector: 'x-app',
  templateUrl: '/app/app.html',
  directives: [
    ng.router.ROUTER_DIRECTIVES,
    require('./header.component'),
  ],
}).Class({
  constructor: [function() {
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
  }],
});

ng.router.RouteConfig([{
  path: '/app/', name: 'Home', component: require('./home.component'),
}, {
  path: '/app/upload', name: 'Upload', 
  component: require('./upload.component'), 
}])(AppComponent);

module.exports = AppComponent;


/*
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



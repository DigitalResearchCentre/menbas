'use strict';

require('./app.less');
var config = require('./config')
  , React = require('react')
  , d3 = require('d3')
  , _ = require('underscore')
  , LineChart = require('./linechart')
  , MyChart = require('./mychart')
;

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

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <LineChart/>
        <MyChart/>
      </div>
    );
  },
});

React.render(
  <App></App>,
  document.body
);



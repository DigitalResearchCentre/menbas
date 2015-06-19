'use strict';

var d3 = require('d3');

var svg = d3.select('body').append('svg:svg');

svg.append('svg:g').selectAll('path')
  .data(['hello', 'world'])
  .enter().append('path').text(function(d) {return d;})
;


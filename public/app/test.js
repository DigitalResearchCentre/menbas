'use strict';

var d3 = require('d3');
var _ = require('underscore');

var svg = d3.select('body').append('svg:svg')
  .attr({height: 3000, width: 500})
;

var data = {
  ei: 1.2,
  tic: 24.3,
  lp: 26.2,
  lbp: 1.1,
  tp: 27.3,
  br: 23.1,
  fp: 4.2,
  l: 0.1,
  asi: 1.1,
};

svg.append('svg:g').selectAll('path')
  .data(['hello', 'world'])
  .enter().append('path').text(function(d) {return d;})
;

data = [[
  {x: 1, y: 1},
  {x: 1, y: 2},
  {x: 6, y: 3},
  {x: 2, y: 4},
  {x: 5, y: 5},
]];

var line = d3.svg.line()
    .x(function(d) { return d.x * 50; })
    .y(function(d) { return d.y * 50; })
;

var myline = function(interp) {
  return line.interpolate(interp);
};

var h = 0;
_.each(['cardinal'], function(interp) {
  var g = svg.append('g').attr('transform', 'translate(20,'+h+')');
  h += 250;
  g.selectAll('.link').data(data)
    .enter().append('path').attr({'class': 'link', 'd': myline(interp)})
  ;
  g.selectAll('.node').data(data[0])
    .enter().append('g').attr({
    'class': 'node', 'transform': function(d) {
      return 'translate(' + d.x * 50 + ',' + d.y * 50 + ')';
    }
  }).append('circle').attr('r', 3);

  
});

/*
 *svg.append('defs').append('marker')
  .attr({
    id: 'arrow',
    refX: 4, refY: 3,
    markerWidth: 100, markerHeight: 100,
    orient: 'auto'
  })
  .append('path').attr('d', 'M 0,0 V 8 L12,4 Z')
;


var line = d3.svg.line().x(function(point) {
  return point.lx;
}).y(function(point) {
  return point.ly;
});

var ns = {
  'root': {name: 'root'},
  'c1': {name: 'c1'},
  'c11': {name: 'c11'},
  'c12': {name: 'c12'},
  'c2': {name: 'c2'},
};

ns.root.children = [ns.c1, ns.c2];
ns.c1.children = [ns.c11, ns.c12];

var cluster = d3.layout.cluster().size([400, 400]);
var nodes = cluster.nodes(ns.root);
var links = cluster.links(nodes);

var link = svg.selectAll('.link').data([
    {source: ns.root, target: ns.c11},
    {source: ns.c12, target: ns.root},
    {source: ns.c11, target: ns.c12},
    {source: ns.c2, target: ns.c1},
  ])
  .enter()
    .append('path')
    .attr({
      'class': 'link',
      'marker-end': 'url(#arrow)',
      'd': d3.svg.diagonal(),
    })
;

var node = svg.selectAll('.node').data(nodes)
  .enter().append('g')
    .attr({
      'class': 'node',
      'transform': function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      }
    })
  .append('circle')
    .attr('r', 0)
;

window.env = {
  nodes: nodes,
  links: links,
}
*/

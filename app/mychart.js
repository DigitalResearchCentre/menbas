'use strict';

require('./chart.less');
var React = require('react');
var $ = require('jquery');
var d3 = require('d3');
var _ = require('underscore');
var myChartData = require('../data/mychart');

var d3MyChart= {
  _setProps: function(el, props) {
  
  },
  _findMinMax: function(data, f) {
    var min = null, max = null;
    _.each(data, function(row) {
      var minmax = d3.extent(row, f);
      if (min === null || min > _.min(minmax)) {
        min = _.min(minmax);
      }
      if (max === null || max < _.max(minmax)) {
        max = _.max(minmax);
      }
    });
    return [min, max];
  },
  create: function(el, props, state) {
    var chart = d3.select(el)
      .append('svg')
      .append('g').attr('class', 'chart')
    ;
    this.update(el, props, state);
  },
  update: function(el, option, data) {
    var svg = d3.select(el).select('svg')
      , chart = svg.select('.chart')
      , left = 30
      , top = 30
      , bottom = 30
      , props = option.props
      , width = props.width - left
      , height = props.height - top - bottom
      , rect, line
    ;
    svg.attr({width: props.width, height: props.height});
    chart.attr('transform', 'translate(' + left + ', ' + top + ')');
   
    rect = chart.selectAll('.round-rect').data(myChartData.rect.data);
    var rectEnter = rect.enter().append('g').attr({
      'class': 'round-rect',
    });
    rectEnter.append('rect');
    rectEnter.append('text');

    rect.attr('transform', function(d) {
      return d.transform;
    });

    rect.select('rect').attr({
      width: myChartData.rect.width,
      height: myChartData.rect.height,
      fill: myChartData.rect.fill,
      stroke: myChartData.rect.stroke,
      rx: 20,
      ry: 20,
      'stroke-width': myChartData.rect['stroke-width'],
    });
    rect.select('text').attr({
      width: myChartData.rect.width - 10,
      transform: 'translate(10,' + (myChartData.rect.height / 2 - 10) + ')',
    }).text(function(d) {
      return d.name;
    });
    rect.exit().remove();

    var dict = {
      "UPH": "Unharvested phytomass (UPH)",
      "LP": "Land produce (LP)",
      "LBP": "Livestock-barnyard produce (LBP)",
      "TP": "Total produce (TP)",
      "BR": "Biomass reused (BR)",
      "FW": "Farmland waste (FW)",
      "FP": "Final produce (FP)",
      "LBS": "Livestock-barnyard services (LBS)",
      "LBW": "Livestock-barnyard waste (LBW)",
      "FCSI": "Farming community societal inputs (FCSI)",
      "ASI": "Agroecosystem societal inputs (ASI)",
      "L": "Labour (L)",
      "FCI": "Farming community inputs (FCI)",
      "EI": "External inputs (EI)",
      "TIC": "Total inputs consumed (TIC)"
    };


    line = chart.selectAll('.line').data(myChartData.line.data);
    var lineEnter = line.enter().append('g').attr({
      'class': 'line',
    });
    lineEnter.append('path');
    var lineFunc = d3.svg.line().interpolate('cardinal')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
    ;
    if (data.places) {
      data = data.places[myChartData.place];
      line.select('path').attr({
        stroke: 'orange',
        fill: 'none',
        d: function(d) {
          return lineFunc(d.path);
        },
      }).attr('stroke-width', function(d) {
        if (d['stroke-width']) {
          return d['stroke-width'];
        }
        var found = _.find(data[dict[d.name]], function(v) {
          return parseInt(v[0]) === myChartData.year;
        });
        var r = (found[1] / 1.5);
        return r < 0.5 ? 0.5 : r;
      });
      line.exit().remove();
    }
  },
  destroy: function(el) {
    
  },
};

var MyChart = React.createClass({
  mixins: [React.addons.LinkedStateMixin,],
  getInitialState: function() {
    return {
      data: {},
      props: {},
    };
  },
  componentDidUpdate: function() {
    var el = React.findDOMNode(this)
      , state = this.state
    ;
    d3MyChart.update(el, {
      props: state.props
    }, state.data);
  },
  componentDidMount: function() {
    var el = React.findDOMNode(this)
      , $props = $.get('../data/linechart1.json')
      , $data = $.get('../data/energy.json')
      , self = this
    ;
    $.when($props, $data).done(function($props, $data) {
      d3MyChart.create(el, {props: $props[0]}, {});
      self.setState({
        props: $props[0],
        data: $data[0],
      });
    });
  },
  render: function() {
    return (
      <div className="myChart">
      </div>
    );
  },
});

module.exports = MyChart;



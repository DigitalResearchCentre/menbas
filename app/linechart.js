'use strict';

require('./chart.less');
var React = require('react');

var d3 = require('d3');

var d3LineChart = {
  create: function(el, props, state) {
    var left = 50
      , top = 10
      , bottom = 30
      , width = props.width - left
      , height = props.height - top - bottom
      , x = d3.scale.linear().range([0, width])
      , y = d3.scale.linear().range([height, 0])
      , svg, xAxis, yAxis
    ;
    svg = d3.select(el)
      .append('svg').attr({width: props.width, height: props.height})
      .append('g').attr('transform', 'translate(' + left + ', ' + top + ')')
    ;

    xAxis = d3.svg.axis().scale(x).orient('bottom');
    yAxis = d3.svg.axis().scale(y).orient('left');


    x.domain([0, 50]);
    y.domain([0, 50]);

    svg.append('g').attr({
      'class': 'x axis',
      'transform': 'translate(0, ' + height + ')'
    }).call(xAxis);
    svg.append('g').attr({
      'class': 'y axis',
    }).call(yAxis);

    var line = d3.svg.line()
      .x(function(d) {return x(d.x);})
      .y(function(d) {return y(d.y);})
    ;

    var data = [{x:1, y:1}, {x:2, y:2}, {x: 16, y: 35}, {x:34, y: 45}];
    svg.append('path').datum(data)
      .attr({
        'class': 'line',
        'd': line
      })
    ;

    this.update(state);
  },
  update: function(state) {
    
  },
  destroy: function() {
    
  },
};

var LineChart = React.createClass({
  mixins: [React.addons.LinkedStateMixin,],
  getInitialState: function() {
    var data = [{x:1, y:1}, {x:2, y:2}, {x: 16, y: 35}, {x:34, y: 45}]
      , xAxisScale = d3.extent(data, function(d){ return d.x; })
      , yAxisScale = d3.extent(data, function(d){ return d.y; })
    ;

    return {
      data: data,
      xAxisScale: xAxisScale.join(', '),
      yAxisScale: yAxisScale.join(', '),
    };
  },
  componentDidUpdate: function() {
    console.log('update');
    console.log(this.state);
    //d3LineChart.update(el, {}, {});
  },
  componentDidMount: function() {
    var el = React.findDOMNode(this);
    d3LineChart.create(el, {
      width: 500,
      height: 500,
    }, {});
  },
  render: function() {

    return (
      <div className="lineChart">
        <div className="form-group">
          <label>X Axis Scale: </label>
          <input type="text" className="form-control" 
            valueLink={this.linkState('xAxisScale')} />
        </div>
        <div className="form-group">
          <label>Y Axis Scale: </label>
          <input type="text" className="form-control" 
            valueLink={this.linkState('yAxisScale')} />
        </div>
      </div>
    );
  },
});

module.exports = LineChart;

// Bar chart

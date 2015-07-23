'use strict';

require('./chart.less');
var React = require('react');
var $ = require('jquery');
var d3 = require('d3');
var _ = require('underscore');

var d3LineChart = {
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
    chart.append('g').attr('class', 'x axis');
    chart.append('g').attr('class', 'y axis');
    this.update(el, props, state);
  },
  update: function(el, option, data) {
    var svg = d3.select(el).select('svg')
      , chart = svg.select('.chart')
      , left = 50
      , top = 10
      , bottom = 30
      , props = option.props
      , chartType = option.chart
      , width = props.width - left
      , height = props.height - top - bottom
      , x = d3.scale.linear().range([0, width])
      , y = d3.scale.linear().range([height, 0])
      , c20 = d3.scale.category20()
      , xAxis, yAxis, line, flag
    ;
    svg.attr({width: props.width, height: props.height});
    chart.attr('transform', 'translate(' + left + ', ' + top + ')');

    xAxis = d3.svg.axis().scale(x).orient('bottom');
    yAxis = d3.svg.axis().scale(y).orient('left');
    
    if (chartType === 'all') {
      data = _.map(data, function (v, k) {
        var row = [];
        _.each(v, function(d) {
          var year = parseInt(d[0]), energy = parseFloat(d[1]);
          if (!(_.isNaN(year) || _.isNaN(energy))) {
            return row.push([year, energy]);
          }
        });
        row.flagtext = k;
        return row;
      });
    } else {
      data = _.map(data, function (energy, k) {
        var fp = energy['Final produce (FP)']
          , tic = energy['Total inputs consumed (TIC)']
          , feroi = {}
        ;
        _.each(fp, function(d) {
          var year = d[0];
          if (!feroi[year]) feroi[year] = {};
          feroi[year].fp = d[1];
        });
        _.each(tic, function(d) {
          var year = d[0];
          if (!feroi[year]) feroi[year] = {};
          feroi[year].tic = d[1];
        });
        var row = [];
        _.each(feroi, function(v, year) {
          var tic = parseFloat(v.tic)
            , fp = parseFloat(v.fp)
          ;
          if (!(_.isNaN(tic) || _.isNaN(fp)) && tic !== 0) {
            row.push([year, fp / tic]);
          }
        });
        row.flagtext = k;
        return row;
      });
    }
    c20 = c20.domain(data);

    x.domain(this._findMinMax(data, function(d) {return d[0];}));
    y.domain(this._findMinMax(data, function(d) {return d[1];}));
   
    chart.select('.x.axis').attr({
      'transform': 'translate(0, ' + height + ')'
    }).call(xAxis);
    chart.select('.y.axis').call(yAxis);

    line = chart.selectAll('.line').data(data);
    line.enter()
      .append('path').attr({
        'class': 'line',
      })
    ;
    line.attr('d', d3.svg.line().x(function(d) {
      return x(d[0]);
    }).y(function(d) {
      return y(d[1]);
    })).attr('stroke', c20);

    line.exit().remove();

    flag = chart.selectAll('.flag').data(data);
    var flagEnter = flag.enter().append('g').attr('class', 'flag') ;
    flagEnter.append('rect').attr({
      'width': 15, 'height': 15,
    });
    flagEnter.append('text')
      .attr('transform', 'translate(20, 13)') 
    ;

    var i = 0;
    flag.attr('fill', c20).attr('transform', function(d) {
      i += 1;
      return 'translate(20, ' + (i * 18) + ')';
    });
    flag.select('text').text(function(d) {
      return d.flagtext; 
    });
    flag.exit().remove();
  },
  destroy: function(el) {
    
  },
};

var LineChart = React.createClass({
  mixins: [React.addons.LinkedStateMixin,],
  getInitialState: function() {
    return {
      places: [],
      curPlace: {},
      charts: ['all', 'EROI'],
      chart: 'all',
      props: {},
    };
  },
  componentDidUpdate: function() {
    var el = React.findDOMNode(this)
      , state = this.state
      , curPlace = state.curPlace
      , chart = state.chart
    ;
    if (chart === 'all') {
      if (curPlace) {
        d3LineChart.update(el, {
          chart: state.chart,
          props: state.props
        }, state.places[state.curPlace]);
      }
    } else {
      d3LineChart.update(el, {
        chart: state.chart,
        props: state.props
      }, state.places);
    }
  },
  componentDidMount: function() {
    var el = React.findDOMNode(this)
      , $props = $.get('../data/linechart1.json')
      , $data = $.get('../data/energy.json')
      , self = this
    ;
    $.when($props, $data).done(function($props, $data) {
      d3LineChart.create(el, {props: $props[0]}, {});
      self.setState({
        places: $data[0].places,
        curPlace: _.keys($data[0].places)[0],
        props: $props[0],
      });
    });
  },
  onPlaceChange: function(event) {
    this.setState({curPlace: event.target.value});
  },
  onChartChange: function(event) {
    this.setState({chart: event.target.value});
  },
  render: function() {
    var places = _.map(this.state.places, function(data, place) {
      return (
        <option value={place}>{place}</option>
      );
    });
    var charts = _.map(this.state.charts, function(chart) {
      return (
        <option value={chart}>{chart}</option>
      );
    });
    return (
      <div className="lineChart">
        <div className="form row">
          <div className="form-group">
            <select onChange={this.onChartChange}>{charts}</select>
            {(this.state.chart === 'all') &&
              <select onChange={this.onPlaceChange}>{places}</select>
            }
          </div>
        </div>
      </div>
    );
  },
});

module.exports = LineChart;

// Bar chart

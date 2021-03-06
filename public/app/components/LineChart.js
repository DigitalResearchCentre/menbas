import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';
import canvg from 'canvg-browser';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    this.renderD3(nextProps);
    //console.log(nextProps);
    /*
        <canvas ref={(canvas)=>this.canvas = canvas;}></canvas>
    if (nextProps.export === 'jpg') {

    } else {
    }*/
    //canvg(this.canvas, this.svg, {ignoreMouse: true});
    //img = this.canvas.toDataURL('image/jpg');
  }

  componentDidMount() {
    this.renderD3(this.props);
  }

  renderD3(props) {
    const {
      left = 100,
      right = 100,
      top = 10,
      bottom = 50,
      flagWidth = 15,
      flagHeight = 15,
      flagTextTransform = [20, 13],
      flagTransform = [20, 18],
      data: {
        labels,
        lines,
        places,
        bars,
      }
    } = props;

    const {
      xAxisDomain,
      yAxisDomain,
    } = this.state;

    const {
      width: clientWidth,
      height: clientHeight,
    } = this.svg.getBoundingClientRect();

    const width = clientWidth - left - right;
    const height = clientHeight - top - bottom;

    const svg = d3.select(this.svg)
      , chart = svg.select('.chart')
      , x = d3.scale.linear().range([0, width])
      , y = d3.scale.linear().range([height, 0])
      , xBar = d3.scale.ordinal().rangeRoundBands([0, width], 0.3)
      , yBar = d3.scale.linear().range([height, 0])
      , c20 = d3.scale.category20()
    ;
    let cMin = props.data.yMin
      , cMax = props.data.yMax;
    let xAxis, yAxis, line, bar, flag;
    chart.attr('transform', `translate(${left}, ${top})`);

    x.domain(this.extent(lines, d => d[0]));
    xBar.domain(places);

    if (!yAxisDomain) {
      y.domain(this.extentTop(lines, d => d[1], cMin, cMax));
      yBar.domain(this.extentTop(bars, d => d[1], cMin, cMax));
    } else {
      y.domain(yAxisDomain.split(','));
      yBar.domain(yAxisDomain);
    }

    xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat(d3.format());
    yAxis = d3.svg.axis().scale(y).orient('left');

    if (bars.length > 0) {
      xAxis = d3.svg.axis().scale(xBar).orient('bottom');
      yAxis = d3.svg.axis().scale(yBar).orient('left');
    }

    chart.select('.x.axis')
        .attr({
          'transform': `translate(0, ${height})`,
        })
        .call(xAxis)
      .selectAll('text')
    ;
    chart.select('.y.axis').call(yAxis);

    line = chart.selectAll('.line').data(_.map(lines, function(row) {
      return _.sortBy(row, (d)=>d[0]);
    }));
    line.enter().append('path').attr({ 'class': 'line', });
    line.attr({
      d: d3.svg.line().x(d => x(d[0])).y(d => y(d[1])),
      stroke: (d, i) => c20(i),
      fill: "none"
    });

    line.exit().remove();

    bar = chart.selectAll('.bar').data(_.flatten(bars));
    let barWidth = xBar.rangeBand() / bars.length;
    bar.enter().append('rect').attr({
      'class': 'bar',
    });
    bar.attr({
      'x': (d) => xBar(d[0]) + (barWidth * d[2]),
      'y': (d) => yBar(d[1]),
      'width':  barWidth,
      'height': (d) => height - yBar(d[1]),
      'stroke': (d) => c20(d[2]),
      'fill': (d) => c20(d[2]),
    });
    bar.exit().remove();


    flag = chart.selectAll('.flag').data(labels);
    const flagEnter = flag.enter().append('g').attr('class', 'flag') ;
    flagEnter.append('rect').attr({
      'width': flagWidth, 'height': flagHeight,
    });

    flagEnter.append('text').attr(
      'transform',
      `translate(${flagTextTransform[0]}, ${flagTextTransform[1]})`);

    flag.attr({
      fill: (d, i) => c20(i),
      transform: function(d, i) {
        let [left, top] = flagTransform;
        return `translate(${left}, ${top * i})`;
      },
    });
    flag.select('text').text(function(d) {
      return d || '';
    });
    flag.exit().remove();
  }

  extent(lines, accessor) {
    return _.reduce(lines, function(minmax, line) {
      const [mins, maxs] = _.zip(minmax, d3.extent(line, accessor));
      return [_.min(mins), _.max(maxs)];
    }, [Infinity, 0]);
  }

  extentTop(lines, accessor, customizedMin, customizedMax) {
    return _.reduce(lines, function(minmax, line) {
      const [mins, maxs] = _.zip(minmax, d3.extent(line, accessor));
      let min, max;
      _.min(mins)< 0 ? min = _.min(mins) : min = 0;
      ((customizedMin === null) || (customizedMin === undefined))  ? min = min : min = customizedMin;
      ((customizedMax === null) || (customizedMax === undefined)) ?  max = _.max(maxs) : max = customizedMax;
      //return _.min(mins)< 0 ? [_.min(mins), _.max(maxs)] : [0, _.max(maxs)];
      return [min, max];
    }, [Infinity, 0]);
  }

  render() {
    return (
      <div className="chart">
        <svg ref={(svg) => this.svg = svg}>
          <g className="chart">
            <g className="x axis"/>
            <g className="y axis"/>
          </g>
        </svg>
      </div>
    );
  }
}


export default LineChart;

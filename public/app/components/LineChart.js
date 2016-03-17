import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';

class LineChart extends Component {

  componentWillReceiveProps(nextProps) {
    this.renderD3(nextProps);
  }

  componentDidMount() {
    this.renderD3(this.props);
  }

  renderD3(props) {
    const {
      width = 800, 
      height = 640, 
      left = 100,
      right = 100,
      top = 10,
      bottom = 200,
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

    console.log(labels);
    console.log(lines);
    console.log(bars);
    console.log(places);

    const svg = d3.select(this.svg)
      , chart = svg.select('.chart')
      , x = d3.scale.linear().range([0, width])
      , y = d3.scale.linear().range([height, 0])
      , xBar = d3.scale.ordinal().rangeRoundBands([0, width], 0.1)
      , yBar = d3.scale.linear().range([height, 0])
      , c20 = d3.scale.category20()
    ;
    let xAxis, yAxis, line, bar, flag;
    svg.attr({width: width + left + right, height: height + top + bottom});
    chart.attr('transform', `translate(${left}, ${top})`);

    xAxis = d3.svg.axis().scale(x).orient('bottom');
    yAxis = d3.svg.axis().scale(y).orient('left');

    x.domain(this.extent(lines, d => d[0]));
    y.domain(this.extent(lines, d => d[1]));

    xBar.domain(places);
    yBar.domain(this.extent(bars, d => d[1]));

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
        .attr({'transform': 'rotate(90)'})
        .style("text-anchor", "start")
    ;
    chart.select('.y.axis').call(yAxis);

    line = chart.selectAll('.line').data(lines)
    line.enter().append('path').attr({ 'class': 'line', });
    line.attr({
      d: d3.svg.line().x(d => x(d[0])).y(d => y(d[1])),
      stroke: (d, i) => c20(i),
    });

    line.exit().remove();

    bar = chart.selectAll('.bar').data(_.flatten(bars));
    let barWidth = xBar.rangeBand() / bars.length;
    window.xBar = xBar;
    bar.enter().append('rect').attr({ 
      'class': 'bar',
      'x': (d) => xBar(d[0]),
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

  render() {
    return (
      <div>
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


import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';

class LineChart extends Component {
  extent(lines, accessor) {
    return _.reduce(lines, function(minmax, line) {
      const [mins, maxs] = _.zip(minmax, d3.extent(line, accessor));
      return [_.min(mins), _.max(maxs)];
    }, [Infinity, 0]);
  }

  componentDidMount() {
    const {
      width = 800, 
      height = 600, 
      left = 100,
      top = 10,
      bottom = 30,
      flagWidth = 15,
      flagHeight = 15,
      flagTextTransform = 'translate(20, 13)',
      flagTransform = [20, 18],
      lines,
    } = this.props;

    const svg = d3.select(this.svg)
      , chart = svg.select('.chart')
      , x = d3.scale.linear().range([0, width - left])
      , y = d3.scale.linear().range([height - top - bottom, 0])
      , c20 = d3.scale.category20()
    ;
    let xAxis, yAxis, line, lineFunc, flag;
    svg.attr({width: width, height: height});
    chart.attr('transform', `translate(${left}, ${top})`);

    xAxis = d3.svg.axis().scale(x).orient('bottom');
    yAxis = d3.svg.axis().scale(y).orient('left');

    x.domain(this.extent(lines, d => d[0]));
    y.domain(this.extent(lines, d => d[1]));
    lineFunc = d3.svg.line().x(d => x(d[0])).y(d => y(d[1]));
   
    chart.select('.x.axis').attr({
      'transform': `translate(0, ${height - top - bottom})`,
    }).call(xAxis);
    chart.select('.y.axis').call(yAxis);

    console.log(lines);
    line = chart.selectAll('.line').data(lines)
    line.enter().append('path').attr({ 'class': 'line', });
    line.attr({
      d: function(d) {
        console.log(d);
        console.log(lineFunc([200, 300]));
        return lineFunc(_.isArray(d) ? d : d.data);
      },
      stroke: c20
    });

    line.exit().remove();

    flag = chart.selectAll('.flag').data(lines);
    const flagEnter = flag.enter().append('g').attr('class', 'flag') ;
    flagEnter.append('rect').attr({
      'width': flagWidth, 'height': flagHeight,
    });
    flagEnter.append('text').attr('transform', flagTextTransform);

    flag.attr({
      fill: (d, i) => c20(i),
      transform: function(d, i) {
        let [left, top] = flagTransform;
        return `translate(${left}, ${top * i})`; 
      },
    });
    flag.select('text').text(function(d) {
      return d.label || ''; 
    });
    flag.exit().remove();   
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


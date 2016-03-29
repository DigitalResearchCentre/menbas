import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';
import '../utils/sankey';


class SankeyChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    this.renderD3(nextProps);
  }

  componentDidMount() {
    this.renderD3(this.props);
  }

  renderD3(props) {
    let sankey = d3.sankey()
      .nodeWidth(36)
      .nodePadding(10)
      .size([960, 800])
    ;
    
    let nodeMap = {};
    let svg = d3.select(this.svg);
    let data = props.data;
    let max = _.maxBy(data, 'value');
    let width = 960, height = 800;
    let flagOpts = {
      width: 14, height: 14, transform: [20, 13],
      left:  width - 150, top: 18,
    }
    
    if (_.isEmpty(data)) return;

    data = _.filter(data, function(d) {
      return [
        'SR', 'UPH', 'LP', 'LBP', 'TP', 'BR', 'FW', 'FP', 'LBS',
        'LBW', 'FCSI', 'ASI', 'L', 'FCI', 'EI', 'TIC',
      ].indexOf(d.abbr) !== -1;
    });
    let abbrs = _.groupBy(data, 'abbr');

    let flag = svg.select('g.flags').selectAll('.flag').data(data);

    let flagEnter = flag.enter().append('g').attr('class', 'flag');
    flagEnter.append('text').attr({
      'transform': 
        `translate(${flagOpts.transform[0]}, ${flagOpts.transform[1]})`,
    });

    flag.attr({
      transform: function(d, i) {
        let {left, top} = flagOpts;
        top = height - top * ((data || []).length - i);
        return `translate(${left}, ${top})`; 
      },
    });
    flag.select('text').text(function(d) {
      return d.abbr + ': ' + d.energy; 
    });
    flag.exit().remove();   

    let nodes = _.map(data, function(n) {
      return nodeMap[n.abbr] = {
        ...n,
        value: 70 * n.value / max,
      };
    });

    let links = _.map([
      ['LP', 'TP'],
      ['LBP', 'TP'],
      ['TP', 'BR'],
      ['TP', 'FP'],
      ['FP', 'ASI'],
      ['ASI', 'EI'],
      ['BR', 'TIC'],
    ], function(link) {
      return {
        source: nodeMap[link[0]],
        target: nodeMap[link[1]],
        value: nodeMap[link[1]].value || 1,
      };
    });
    sankey.nodes(nodes).links(links).layout(32);

    let link = svg.select('g.links').selectAll('.link').data(links)
      .enter().append('path')
        .attr("class", "link")
        .attr("d", function(d) {
          let x0 = d.source.x + d.source.dx
            , y0 = d.source.y + d.sy + d.dy / 2
            , x3 = d.target.x
            , y3 = d.target.y + d.ty + d.dy / 2
          ;
          return d3.svg.line().interpolate('cardinal')([
            [x0, y0], [], [x3, y3]
          ]);
        })
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy); 
        });
    link.append("title")
        .text(function(d) {
      	return d.source.abbr + " → " + 
                d.target.abbr + "\n" + d.value; });

    var node = svg.select('g.nodes').selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; 
      })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() {this.parentNode.appendChild(this); })
      .on("drag", dragmove));

    node.append("rect")
      .attr("height", function(d) { 
        return d.dy; 
      })
      .attr("width", sankey.nodeWidth())
    .append("title")
      .text(function(d) { return d.name + "\n" + d.value; });

    svg.select('g.nodes').each(function() {
      this.parentNode.appendChild(this);
    });
      
    function dragmove(d) {
      let x = d.x = Math.max(0, Math.min(800 - d.dx, d3.event.x));
      let y = d.y = Math.max(0, Math.min(600 - d.dy, d3.event.y));
      d3.select(this).attr('transform', 'translate(' + x  + ',' + y + ')');
      sankey.relayout();
      link.attr("d", path);
    }
  }

  render() {
    return (
      <div className="viewer">
        <div className="chart">
          <svg ref={(svg) => this.svg = svg}>
            <g className="flags"></g>
            <g className="nodes"></g>
            <g className="links"></g>
          </svg>
        </div>
      </div>
    );
  }
}


export default SankeyChart;


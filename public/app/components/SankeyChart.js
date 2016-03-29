import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';
import 'd3-plugins-sankey';



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
      .size([800, 600])
    ;
    let color = d3.scale.category20();
    
    let path = sankey.link();
    let nodeMap = {};
    let svg = d3.select(this.svg);
    let abbrs = _.groupBy(props.data, 'abbr');
    let nodes = _.map(props.data, function(n) {
      let nn = _.pick(n, ['abbr', 'value']);
      nodeMap[n.abbr] = nn;
      return nn;
    });
    if (_.isEmpty(props.data)) return;
    let links = _.map([
      ['LP', 'TP'],
      ['LP', 'LBP'],
      ['TP', 'BR'],
      ['TP', 'FP'],
      ['FP', 'ASI'],
      ['ASI', 'EI'],
      ['BR', 'TIC'],
    ], function(link) {
      return {
        source: nodeMap[link[0]],
        target: nodeMap[link[1]],
        value: nodeMap[link[1]].value || 0.1,
      };
    });
    sankey.nodes(nodes).links(links).layout(32);

    let link = svg.select('g.links').selectAll('.link').data(links)
      .enter().append('path')
        .attr("class", "link")
        .attr("d", function(d) {
          return path(d);
        })
        .style("stroke-width", function(d) { return Math.max(1, d.dy); });
    link.append("title")
        .text(function(d) {
      	return d.source.abbr + " → " + 
                d.target.abbr + "\n" + d.value; });

    var node = svg.select('g.nodes').selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })

      /*
       *    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { 
		  this.parentNode.appendChild(this); })

      .on("drag", dragmove));
      function dragmove(d) {
        d3.select(this).attr("transform", 
                             "translate(" + (
                               d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                             ) + "," + (
                             d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                             ) + ")");
                             sankey.relayout();
                             link.attr("d", path);
      }
      */
  }

  render() {
    /*
               <svg ref={(svg) => this.svg = svg}>
            <g className="nodes"></g>
            <g className="links"></g>
          </svg>

    * */
    return (
      <div className="viewer">
        <div className="chart">
        </div>
      </div>
    );
  }
}


export default SankeyChart;


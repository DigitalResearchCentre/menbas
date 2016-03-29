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
    console.log(props.data.abbrs);
    let color = d3.scale.category20();
    
    let path = sankey.link();
    let nodeMap = {};
    let svg = d3.select(this.svg);

    let nodes = _.map([
      {"name":"Energy"},
      {"name":"Industrial Processes"},
      {"name":"Electricity and heat"},
    ], function(n) {
      nodeMap[n.name] = n;
      return n;
    });
    let links = _.map([{
      "source":"Energy",
      "target":"Industrial Processes", "value":"1.2"
    }, {
      "source":"Energy",
      "target":"Electricity and heat","value":"0.3"
    }], function(l) {
      return {
        source: nodeMap[l.source],
        target: nodeMap[l.target],
        value: l.value,
      };
    });
    sankey.nodes(nodes).links(links).layout(32);

    let link = svg.select('g.links').selectAll('.link').data(links)
      .enter().append('path')
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });
    link.append("title")
        .text(function(d) {
      	return d.source.name + " → " + 
                d.target.name + "\n" + d.value; });

    var node = svg.select('g.nodes').selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
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
  }

  render() {

    /**
              <h1>hello </h1>
          <svg ref={(svg) => this.svg = svg}>
            <g className="nodes"></g>
            <g className="links"></g>
          </svg>

     */
    return (
      <div className="viewer">
        <div className="chart">
        </div>
      </div>
    );
  }
}


export default SankeyChart;


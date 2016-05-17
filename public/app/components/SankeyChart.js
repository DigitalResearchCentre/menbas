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
    let nodeMap = {};
    let svg = d3.select(this.svg);
    let data = props.data;
    let max = _.maxBy(data, 'value');
    let width = 800, height = 600; // 3200 2400
    let config = props.config;
    let flagOpts = {
      width: 14, height: 14, transform: [20, 13],
      left: width - 250, top: 18,
    }

    let abbrs = _.groupBy(data, 'abbr');
    let areaTotal = _.get(abbrs, 'AREA_TOT.0.value');
    if (!areaTotal) {
      svg.select('g.links').selectAll('.link').data([]).exit().remove();
      svg.select('g.nodes').selectAll('.node').data([]).exit().remove();
      return;
    };

    let rect = svg.select('g.rects').selectAll('.rect');

    rect.select('rect')
      .attr({
        width: height / 4,
        height: height / 4,
        rx: height / 40,
      });
    rect.select('text').attr({
      transform: 'translate(30, ' + (height / 9)  + ')',
    })

    let sun = svg.select('g.sun').attr({
      transform: 'translate(70, ' + (height * 2 / 3)  + ')',
    });
    sun.select('circle').attr({
      r: 50,
      fill: 'yellow',
    });
    sun.select('text')
      .attr({
        transform: 'translate(-20, 10)',
      })
      .text(data[0].year);

    let placeInfo = svg.select('g.place').attr({
      transform: 'translate(20, ' + ((height * 2 / 3) + 70)  + ')',
    });
    placeInfo.select('.place-name').text(data[0].place);

    data = _.filter(data, function(d) {
      return [
        'SR', 'UPH', 'LP', 'LBP', 'TP', 'BR', 'FW', 'FP', 'LBS',
        'LBW', 'FCSI', 'ASI', 'L', 'FCI', 'EI', 'TIC',
      ].indexOf(d.abbr) !== -1;
    });

    let flag = svg.select('g.flags')
      .attr({
        'transform':
          `translate(-${height/16}, -${height/16})`,
      })
      .selectAll('.flag').data(data);

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
      if (!config[n.abbr]) {
        config[n.abbr] = {};
      }
      let c = config[n.abbr];
      let node = {
        ...n,
        value: (n.value / areaTotal) || 0,
        x: c.x || width/2,
        y: c.y || height/2,
      };
      nodeMap[n.abbr] = node;
      return node;
    });

    if (!config.links) {
      config.links = [
        ['LP', 'TP', []],
        ['LBP', 'TP', []],
        ['TP', 'BR', []],
        ['TP', 'FP', []],
        ['BR', 'TIC', []],
        ['FP', 'ASI', []],
        ['ASI', 'EI', []],
      ];
    }
    let links = _.map(config.links, function(link) {
      let l = {
        source: nodeMap[link[0]],
        target: nodeMap[link[1]],
        path: link[2],
        value: Math.max(nodeMap[link[1]].value, 1),
      };
      if (_.isEmpty(l.source.sourceLinks)) {
        l.source.sourceLinks = [];
      }
      l.source.sourceLinks.push(l);
      if (_.isEmpty(l.source.targetLinks)) {
        l.source.targetLinks = [];
      }
      l.source.targetLinks.push(l);
      return l;
    });

    let path = function(d) {
      let x0 = d.source.x
        , y0 = d.source.y
        , x3 = d.target.x
        , y3 = d.target.y
      ;
      return d3.svg.line().interpolate('cardinal')([
        [x0, y0], ...(d.path || []), [x3, y3]
      ]);
    };

    let link = svg.select('g.links').selectAll('.link').data(links);

    let linkEnter = link.enter().append('path')
      .attr({
        'class': 'link',
      })
      .on('contextmenu', function(d) {
        d3.event.preventDefault();
        let { layerX, layerY } = d3.event;
        let coords  = _.sortBy(d.path, function([x, y]) {
          return (x - layerX) * (x - layerX) + (y - layerY) * (y - layerY);
        });
        let coord = _.first(coords);
        if (coord) {
          _.remove(d.path, function(c) {
            return c[0] === coord[0] && c[1] === coord[1];
          });
        }
        d3.select(this).attr('d', path);
      })
      .on('dblclick', function(d) {
        let { layerX, layerY } = d3.event;
        if (!d.path) {
          d.path = [];
        }
        d.path.push([layerX, layerY]);
      })
      .call(
        d3.behavior.drag().origin((d)=>d)
        .on('drag', function(d) {
          let { layerX, layerY } = d3.event.sourceEvent;
          let { dx, dy} = d3.event;
          let coords  = _.sortBy(d.path, function([x, y]) {
            return (x - layerX) * (x - layerX) + (y - layerY) * (y - layerY);
          });
          let coord = _.first(coords);
          if (coord) {
            coord[0] += dx;
            coord[1] += dy;
          }
          d3.select(this).attr('d', path);
        })
      )
    ;
    link
      .attr({
        d: path,
      })
      .style("stroke-width", function(d) {
        return Math.max(1, d.value);
      })
    ;

    link.exit().remove();

    let node = svg.select('g.nodes').selectAll(".node").data(nodes);
    let nodeEnter = node.enter().append('g')
      .attr({
        'class': 'node',
      })
      .call(
        d3.behavior.drag().origin((d)=>d)
        .on('dragstart', function() {this.parentNode.appendChild(this);})
        .on('drag', function(d) {
          let { dx, dy } = d3.event;
          d.x += dx;
          d.y += dy;
          config[d.abbr].x = d.x;
          config[d.abbr].y = d.y;
          link.attr('d', path);
          d3.select(this).attr('transform', function(d) {
            return 'translate(' + d.x  + ',' + d.y + ')';
          });
          props.onConfigChange(config);
        })
      )
    ;

    nodeEnter.append('text')
      .text((d)=> { return d.abbr + ' ' + Math.round(d.value * 10) / 10 });
    node.attr({
      'transform': (d)=>'translate(' + d.x  + ',' + d.y + ')',
    });

    node.exit().remove();

    node.each(function() {
      this.parentNode.appendChild(this);
    });
  }

  render() {
    let width = 800, height = 600; // 3200 2400

    return (
      <div className="viewer">
        <div className="chart">
          <svg ref={(svg) => this.svg = svg} id="energy">
            <g className="sun">
              <circle></circle>
              <text></text>
            </g>
            <g className="place">
              <text>
                <tspan className="place-name"></tspan>
                <tspan x="0" dy="20">Farm Energy Profile</tspan>
              </text>
            </g>
            <g className="links"></g>
            <g className="rects">
              <g
                transform={'translate('+(height/8)+','+(height/5)+' )'}
                className="rect">
                <rect
                  className="associated-biodiversity"></rect>
                <text>
                  <tspan>ASSOCIATED</tspan>
                  <tspan x="0" dy="20">BIODIVERSITY</tspan>
                </text>
              </g>
              <g
                transform={
                  'translate('+
                    (height / 8 + height / 5)+','+
                    (height / 5 + height / 5)+' )'}
                className="rect">
                <rect
                  className="farmland"></rect>
                <text>FARMLAND</text>
              </g>
              <g
                transform={
                  'translate('+
                    (height / 8 + (height * 2)/ 5)+','+
                    (height / 5 + (height * 2)/ 5)+' )'}
                className="rect">
                <rect
                  className="livestock-barnyard"></rect>
                <text>
                  <tspan>LIVESTOCK-</tspan>
                  <tspan x="0" dy="20">BARNYARD</tspan>
                </text>
              </g>
              <g
                transform={
                  'translate('+
                    (width - (height/5) - (height/4) - (height/40)) + ','+
                    (height / 40 + height/5) +' )'}
                className="rect">
                <rect className="farming-community"></rect>
                <text>
                  <tspan>FARMING -</tspan>
                  <tspan x="0" dy="20">COMMUNITY</tspan>
                </text>

              </g>
              <g
                transform={
                  'translate('+
                    (width - (height/4) - (height/40)) + ','+
                    (height / 40) +' )'}
                className="rect">
                <rect className="society"></rect>
                <text>SOCIETY</text>
              </g>
            </g>
            <g className="nodes"></g>
          </svg>
        </div>
      </div>
    );
  }
}


export default SankeyChart;

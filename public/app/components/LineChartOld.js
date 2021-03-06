import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';

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
  update: function(svg, option, data, energyName) {
    var svg = d3.select(svg)
      , chart = svg.select('.chart')
      , left = 100
      , top = 10
      , bottom = 30
      , chartType = option.chart
      , _energies = option._energies
      , meta = _energies[energyName]
      , width = option.width - left
      , height = option.height - top - bottom
      , x = d3.scale.linear().range([0, width])
      , y = d3.scale.linear().range([height, 0])
      , c20 = d3.scale.category20()
      , xAxis, yAxis, line, flag
    ;
    svg.attr({width: option.width, height: option.height});
    chart.attr('transform', 'translate(' + left + ', ' + top + ')');

    xAxis = d3.svg.axis().scale(x).orient('bottom');
    yAxis = d3.svg.axis().scale(y).orient('left');

    function getFormulas(_energies, energyMap, i) {
      var formulas = {};
      _.each(energyMap, function(energyData, energyName) {
        formulas[energyName] = {
          abbr: _energies[energyName].abbr,
          value: parseFloat(energyData[i][1].replace(/,/g, '')),
          formula: _energies[energyName].formula
        };
      });
      return formulas;
    }
    
    if (chartType === 'all') {
      data = _.map(data, function (energyMap, place) {
        var row = [];
        _.each(energyMap[energyName], function(yearData, i) {
          let year = parseInt(yearData[0])
            , energy = parseFloat((yearData[1] || '').replace(/,/g, ''))
            , formulas = getFormulas(_energies, energyMap, i)
          ;
          if (!(_.isNaN(year) || _.isNaN(energy))) {
            if (meta.formula) {
              let base =  _.map(formulas, function(formula, energyName) {
                let { abbr, value } = formula;
                return `let ${abbr} = ${value};`
              }).join(' ');
              energy = eval(base + ' ' + meta.formula);
            }
            return row.push([year, energy]);
          }
        });
        row = _.sortBy(row, (d)=>d[0]);
        row.flagtext = place;
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
    console.log(data);
    c20 = c20.domain(_.map(data, (row) => row.flagtext));

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
    flag.attr('fill', function(d) {
      return c20(d.flagtext);
    }).attr('transform', function(d) {
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

class LinChart extends Component {
  createD3(svg) {
    if (svg) {
      this.svg = svg;
    }
    let chart = d3.select(this.svg).append('g').attr('class', 'chart');
    chart.append('g').attr('class', 'x axis');
    chart.append('g').attr('class', 'y axis');
  }

  onEnergyChange(event) {
    console.log(event.target.value);
    let svg = this.svg;
    let file = _.assign({
      width: 1024,
      height: 600,
      chart: 'all',
    }, this.props.file);

    d3LineChart.update(svg, file, file.places, event.target.value);
  }

  render() {
    const { file } = this.props;
    let energyDropdown;
    if (file) {
      let options = _.map(file.energies, (energyName, abbr) => (
          <option key={abbr} value={energyName}>
            {energyName}: {abbr}
          </option>
      ));
      energyDropdown = (
        <select 
          ref={(el)=>{
            if (el) this.selectEnergyEl = el;
          }}
          onChange={this.onEnergyChange.bind(this)}>{options}</select>
      );
      _.each(file.energies, (energyName) => {
        this.onEnergyChange({target: {value: energyName}});
        return false;
      });
    }
    return (
      <div>
        <div>
          {energyDropdown}
        </div>
        <svg ref={(el)=>this.createD3(el)}/>
      </div>
    );
  }
}

export default LinChart;

  /*
    this.el = el;
    this.curPlace = _.keys(this.file.places)[0];
    this.charts = ['all', 'EROI'];
    this.chart = 'all';
    this.places = this.file.places;
    console.log(this.file);


  onPlaceChange: function(event) {
    this.curPlace = event.target.value;
  },
  onChartChange: function(event) {
    var chart = this.chart = event.target.value;
    if (chart === 'all') {
      if (this.curPlace) {
        d3LineChart.update(this.el, {
          chart: chart,
          props: this.file.props
        }, state.places[this.curPlace]);
      }
    } else {
      d3LineChart.update(this.el, {
        chart: chart,
        props: this.file.props
      }, this.file.places);
    }
  },

  ngOnInit: function() {
    this.energies = _.map(this.file._energies, function(energy, key) {
      return {
        abbr: energy.abbreviation,
        energy: key,
        unit: energy.unit,
        formula: energy.abbr || '',
      };
    });
    this.places = _.map(this.file.places, function(place, key) {
      place.energies = _.map(place, function(value, energy) {
        return {
          value: value,
          energy: energy,
        }
      });
      place.key = key;
      return place;
    });
    console.log(this.file);
  },
  */









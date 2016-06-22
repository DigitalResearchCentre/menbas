import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import _ from 'lodash';
import Actions from '../actions';
import LineChart from '../components/LineChart';
import SankeyChart from '../components/SankeyChart';
import saveSvgAsPng from 'save-svg-as-png';
import $ from 'jquery';

function loadState(props, state) {
  const data = _.get(props, 'selectedConfig.data') || {};
  //console.log(data);
  const {
    places = [],
    years = [],
    abbrs = [],
  } = _.get(props, 'selectedConfig.config') || {};
  return {
    ...state,
    places: _.isEmpty(places) ? _.keys(data.places) : places,
    years: _.isEmpty(years) ? _.keys(data.years) : years,
    abbrs: _.isEmpty(abbrs) ? _.keys(data.abbrs) : abbrs,
  };
}
/*
function loadAreaState(props, state) {
  const data = _.get(props, 'selectedConfig.data') || {};
  const {
    places = [],
    years = [],
    abbrs = [],
  } = _.get(props, 'selectedConfig.config') || {};
  return {
    ...state,
    places: _.isEmpty(places) ? _.keys(data.areaPlaces) : places,
    years: _.isEmpty(years) ? _.keys(data.areaYears) : years,
    abbrs: _.isEmpty(abbrs) ? _.keys(data.areaAbbrs) : abbrs,
  };
}
*/
class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = loadState(props, {});
    this.flag = 0;
  }

  componentWillReceiveProps(nextProps) {
    const state = loadState(nextProps, this.state);
    this.sankeyConfig = _.get(nextProps, 'selectedConfig.config.sankey', {});
    if (!_.isEqual(state, this.state)) {
      this.setState(state, () => {
        if (!state.type || (!state.place && !state.abbr && !state.year)) {
          this.selectType('Location');
        }
      });
    }
  }

  onEdit(file) {
    this.props.actions.selectFile(file);
    this.props.actions.showEditCSVModal(true);
  }

  onSankeyConfigChange(sankeyConfig) {
    this.sankeyConfig = sankeyConfig;
  }

  perHectareData() {
    const state = this.state;
    let data = _.get(this.props, 'selectedConfig.data', {});
    if(_.size(data.objects)) {
      if(!this.flag) {
        data.oldPlaces = data.places;
        data.places = {};
        data.places = data.areaPlaces;
        data.oldYears = data.years;
        data.years = {};
        data.years = data.areaYears;
        data.oldAbbrs = data.abbrs;
        data.abbrs = {};
        data.abbrs = data.areaAbbrs;
        this.flag = 1;
        $(".preHectare").text("total");
      }
      else if(this.flag) {
        data.places = data.oldPlaces;
        data.years = data.oldYears;
        data.abbrs = data.oldAbbrs;
        this.flag = 0;
        $(".preHectare").text("per hectare");
      }
    }
    switch(state.type) {
      case "Location":
        this.selectType('Location');
        break;
      case "Indicator":
        this.selectType('Indicator');
        break;
      case "Time":
        this.selectType('Time');
        break;
      default:
        this.selectType('Location');
    }

  }

  exportCsv() {
    let csv = _.get(this.props, 'selectedFile.content', {});
    let data = _.get(this.props, 'selectedConfig.data', {});
    let places = _.keys(_.get(this.props, 'selectedConfig.data.places', {}));
    console.log(places);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += csv;
    var encodedUri = encodeURI(csvContent);
    //window.open(encodedUri);
  }

  renderChart() {
    const state = this.state;
    let data = _.get(this.props, 'selectedConfig.data', {});
    //console.log(this.props);
    let config = _.get(this.props, 'selectedConfig.config', {});
    let chartData = {};
    let places = {};
    if (state.type === 'Energy') {
      data = _.filter(data.places[state.place], function(d) {
        return d.year.toString() === state.year.toString() && (
          _.isEmpty(state.abbrs) || state.abbrs.indexOf(d.abbr) !== -1
        );
      });
      return (
        <SankeyChart data={data} config={this.sankeyConfig}
          onConfigChange={this.onSankeyConfigChange.bind(this)}/>
      )
    }
    if (state.place !== '') {
      data = _.filter(data.places[state.place], function(d) {
        return (
          _.isEmpty(state.years) ||
          state.years.indexOf(d.year.toString()) !== -1
        ) && (
          _.isEmpty(state.abbrs) || state.abbrs.indexOf(d.abbr) !== -1
        );
      });
      data = _.groupBy(data, 'abbr');
      chartData.lines = _.map(data, function(rows) {
        return _.map(rows, (d) => [d.year, d.value]);
      });
      chartData.bars = [];
    } else if (state.abbr !== '') {
      data = _.filter(data.abbrs[state.abbr], function(d) {
        return (
          _.isEmpty(state.years) ||
          state.years.indexOf(d.year.toString()) !== -1
        ) && (
          _.isEmpty(state.places) || state.places.indexOf(d.place) !== -1
        );
      });
      data = _.groupBy(data, 'place');
      chartData.lines = _.map(data, function(rows) {
        return _.map(rows, (d) => [d.year, d.value]);
      });
      chartData.bars = [];
    } else if (state.year !== '') {
      data = _.filter(data.years[state.year], function(d) {
        return (
          _.isEmpty(state.abbrs) ||
          state.abbrs.indexOf(d.abbr.toString()) !== -1
        ) && (
          _.isEmpty(state.places) || state.places.indexOf(d.place) !== -1
        );
      });
      data = _.groupBy(data, 'abbr');
      chartData.lines = [];
      let i = -1;
      chartData.bars = _.map(data, function(rows) {
        i += 1;
        return _.map(rows, function(d) {
          places[d.place] = null;
          return  [d.place, d.value, i];
        });
      });
    }
    chartData.places = _.keys(places);
    chartData.labels = _.keys(data);
    chartData.xAxis = state.xAxis;
    chartData.yAxis = state.yAxis;
    //console.log(chartData);
    return (
      <LineChart data={chartData} />
    );
  }

  selectType(type) {
    const {
      places, years, abbrs,
    } = this.state;
    let place = '', abbr = '', year = '';

    switch (type) {
      case 'Location':
        place = _.first(places);
        break;
      case 'Indicator':
        abbr = _.first(abbrs);
        break;
      case 'Time':
        year = _.first(years);
        break;
      case 'Energy':
        place = _.first(places);
        year = _.first(_.keys(_.groupBy(
          _.get(this.props, 'selectedConfig.data.places', {})[place],
          'year'
        )));
        let abbrs = _.get(this.props, "selectedConfig.data.abbrs");
        this.setState({abbrs: _.keys(abbrs)});
        break;
      default:
        this.setState({type: type});
        return;
    }
    this.setState({type: type, place: place, year: year, abbr: abbr});
  }

  selectPlace(place) {
    if (this.state.type === 'Energy') {
      let years = _.keys(_.groupBy(
        _.get(this.props, 'selectedConfig.data.places', {})[place],
        'year'
      ));
      let abbrs = _.get(this.props, "selectedConfig.data.abbrs");
      let year = this.state.year;
      if (years.indexOf(year) === -1) {
        year = _.first(years);
      }
      this.setState({place: place, abbr: '', year: year});
      this.setState({abbrs: _.keys(abbrs)});
    } else {
      this.setState({place: place, year: '', abbr: ''});
    }
  }

  selectYear(year) {
    if (this.state.type === 'Energy') {
      this.setState({ year: year, abbr: '', });
    } else {
      this.setState({ place: '', year: year, abbr: '', });
    }
  }

  selectAbbr(abbr) {
    this.setState({ place: '', year: '', abbr: abbr, });
  }

  selectPlaces(event) {
    let selected = [];
    _.each(event.target.children, function(option) {
      if (option.selected)  {
        selected.push(option.value);
      }
    });
    this.setState({places: selected});
  }

  selectYears(event) {
    let selected = [];
    _.each(event.target.children, function(option) {
      if (option.selected)  {
        selected.push(option.value);
      }
    });
    this.setState({years: selected});
  }

  selectAbbrs(event) {
    let selected = [];
    _.each(event.target.children, function(option) {
      if (option.selected)  {
        selected.push(option.value);
      }
    });
    this.setState({abbrs: selected});
  }

  toggleConfigs() {
    this.setState({
      showConfigs: !this.state.showConfigs
    });
  }

  onSave() {
    const { places, years, abbrs } = this.state;
    const { actions, selectedConfig } = this.props;
    actions.showEditCSVModal(true);
    actions.selectConfig({
      ...selectedConfig.config,
      places: places,
      years: years,
      abbrs: abbrs,
      sankey: this.sankeyConfig,
    });
  }

  onExportImage() {
    var html = d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("id", "drawChart")
        .node().parentNode.innerHTML;

    var image = new Image();
    image.src = 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(html)));
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    saveSvgAsPng.saveSvgAsPng(document.getElementById("drawChart"), "diagram.png", {backgroundColor: "white"});
  }

  onExportSVG() {
    //get svg element.
  	var svg = document.getElementsByTagName("svg")[0];

  	//get svg source.
  	var serializer = new XMLSerializer();
  	var source = serializer.serializeToString(svg);

  	//add name spaces.
  	if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
  		source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  	}
  	if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
  		source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  	}

  	//add xml declaration
  	source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  	//convert svg source to URI data scheme.
  	var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

  	//set url value to a element's href attribute.
  	//document.getElementById("link").href = url;
  	//you can download svg file by right click menu.

    var link = document.createElement("a");
    link.download = name;
    link.href = url;
    link.click();
  }

  onExport() {
    this.props.actions.export('jpg');
  }

  cleanChart() {
    $(".chartContainer").empty();
    //$(".chartContainer").append(this.renderChart(1));
    //console.log(this.renderChart());
  }

  render() {
    const {
      data,
      config: chartConfig,
    } = this.props.selectedConfig || {};

    let {
      places, years, abbrs,
    } = data || {};

    const type = this.state.type;

    let typesOptions = _.map([
      'Location', 'Indicator', 'Time', 'Energy'
    ], (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    let placesOptions = _.map(_.keys(places), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    if (type === 'Energy' || type === 'Location') {
      years = _.groupBy(data.places[this.state.place], 'year');
    }
    let yearsOptions = _.map(_.keys(years), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    /*
    var abbrsIndicators = _.map(abbrs, function(obj) {
      return _.sample(obj);
    });
    console.log(abbrsIndicators);
    */
    let abbrsOptions = _.map(_.map(abbrs, function(obj) {
      return _.sample(obj);
    }), function(obj) {
       return <option key={obj.abbr} value={obj.abbr}>{obj.energy} ({obj.abbr})</option>;
    });


    //console.log(_.keys(abbrs));
    /*
    let abbrsOptions = _.map(_.keys(abbrs), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    */
    //console.log(abbrsOptions);

    let selectPlaces, selectAbbrs, selectYears;
    if (type !== 'Location' && type !== 'Energy') {
      selectPlaces = (
        <Input type="select" value={this.state.places}
          onChange={this.selectPlaces.bind(this)}
          multiple>
          {placesOptions}
        </Input>
      );
    }
    if (type !== 'Indicator') {
      selectAbbrs = (
        <Input type="select" value={this.state.abbrs}
          onChange={this.selectAbbrs.bind(this)}
          multiple>
          {abbrsOptions}
        </Input>
      );
    }

    if (type !== 'Time' && type !== 'Energy') {
      selectYears = (
        <Input id="yearSelection" type="select" value={this.state.years}
          onChange={this.selectYears.bind(this)}
          multiple>
          {yearsOptions}
        </Input>
      );
    }

    let sp, sa, sy;
    let hb;
    if (type === 'Location' || type === 'Energy') {
      sp = (
        <Input type="select" label="Place: "
          value={this.state.place}
          onChange={(e) => this.selectPlace(e.target.value)}
        >
          {placesOptions}
        </Input>
      )
    }
    if (type === 'Indicator') {
      sa = (
        <Input type="select" label="Indicator: "
          value={this.state.abbr}
          onChange={(e) => this.selectAbbr(e.target.value)}
        >
          {abbrsOptions}
        </Input>
      )
    }
    if (type === 'Energy' || type === 'Time') {
      sy = (
        <Input type="select" label="Year: "
          value={this.state.year}
          onChange={(e) => this.selectYear(e.target.value)}
        >
          {yearsOptions}
        </Input>
      )
    }
    if(_.has(data.abbrs, "AREA")) {
      hb = (
        <Button
          className="preHectare"
          onClick={this.perHectareData.bind(this)}
          bsStyle="primary"
          >per hectare</Button>
      )
    }
    return (
      <div className={
        'viewer ' + (_.isEmpty(chartConfig) ? 'invisible' : '')
      }>
        <div className="nav">
          <div className="sub-nav">
            <Input type="select" label="View By: "
              value={this.state.type}
              groupClassName="select-type"
              onChange={(e) => this.selectType(e.target.value)}
            >
              {typesOptions}
            </Input>
            {sp}
            {sa}
            {sy}
          </div>
          <div className={ 'configs ' }>
            {selectPlaces}
            {selectAbbrs}
            {selectYears}
          </div>
        </div>
        <div className="chartContainer">
        {this.renderChart()}
        </div>
        <div>
          <Button
            onClick={this.onSave.bind(this)}
            bsStyle="primary"
          >Edit Setting</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            onClick={this.onExportImage.bind(this)}
            bsStyle="primary"
            >Export Image</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            onClick={this.onExportSVG.bind(this)}
            bsStyle="primary"
            >Export SVG</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          {hb}&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return _.pick(state, [ 'selectedFile', 'selectedConfig' ]);
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer);

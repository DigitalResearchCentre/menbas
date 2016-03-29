import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import _ from 'lodash';
import Actions from '../actions';
import LineChart from '../components/LineChart';
import SankeyChart from '../components/SankeyChart';

function loadState(props, state) {
  const data = _.get(props, 'selectedConfig.data') || {};
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

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = loadState(props, {});
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const state = loadState(nextProps, this.state);
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

  renderChart() {
    const state = this.state;
    let data = _.get(this.props, 'selectedConfig.data', {});
    let chartData = {};
    let places = {};
    if (state.type === 'Energy') {
      return <SankeyChart data={data}/>
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
      default:
        this.setState({type: type});
        return;
    }
    this.setState({type: type, place: place, year: year, abbr: abbr});
  }

  renderViewBy(placesOptions, abbrsOptions, yearsOptions) {
    switch (this.state.type) {
      case 'Location':
        return (
          <Input type="select" label="Place: "
            value={this.state.place}
            onChange={(e) => this.selectPlace(e.target.value)}
          >
            {placesOptions}
          </Input>
        );
      case 'Indicator':
        return (
          <Input type="select" label="Indicator: "
            value={this.state.abbr}
            onChange={(e) => this.selectAbbr(e.target.value)}
          >
            {abbrsOptions}
          </Input>
        );
      case 'Time':
        return (
          <Input type="select" label="Year: "
            value={this.state.year}
            onChange={(e) => this.selectYear(e.target.value)}
          >
            {yearsOptions}
          </Input>
        );
      default:
        return ;
    }
  }

  selectPlace(place) {
    this.setState({place: place, year: '', abbr: ''});
  }

  selectYear(year) {
    this.setState({ place: '', year: year, abbr: '', });
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
    });
  }

  onExport() {
    this.props.actions.export('jpg');
  }

  render() {
    const { 
      data,
      config: chartConfig,
    } = this.props.selectedConfig || {};

    const {
      places, years, abbrs, 
    } = data || {};

    let typesOptions = _.map([
      'Location', 'Indicator', 'Time', 'Energy'
    ], (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    let placesOptions = _.map(_.keys(places), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    let yearsOptions = _.map(_.keys(years), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    let abbrsOptions = _.map(_.keys(abbrs), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    let selectPlaces, selectAbbrs, selectYears;
    if (this.state.type !== 'Location') {
      selectPlaces = (
        <Input type="select" value={this.state.places}
          onChange={this.selectPlaces.bind(this)}
          multiple>
          {placesOptions}
        </Input>
      );
    }
    if (this.state.type !== 'Indicator') {
      selectAbbrs = (
        <Input type="select" value={this.state.abbrs}
          onChange={this.selectAbbrs.bind(this)}
          multiple>
          {abbrsOptions}
        </Input>
      );
    }
    if (this.state.type !== 'Time') {
      selectYears = (
        <Input type="select" value={this.state.years}
          onChange={this.selectYears.bind(this)}
          multiple>
          {yearsOptions}
        </Input>
      );
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
            {this.renderViewBy(placesOptions, abbrsOptions, yearsOptions)}
          </div>
          <div className={ 'configs ' }>
            {selectPlaces}
            {selectAbbrs}
            {selectYears}
          </div>
        </div>
        {this.renderChart()}
        <div>
          <Button
            onClick={this.onSave.bind(this)}
            bsStyle="primary"
          >Edit Setting</Button>
          <Button
            onClick={this.onExport.bind(this)}
            bsStyle="primary"
          >Export</Button>
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



import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import _ from 'lodash';
import Actions from '../actions';
import LineChart from '../components/LineChart';


class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = this.loadState({}, false);
  }

  componentWillReceiveProps(nextProps) {
    this.defaultPlace = _
      .chain(_.get(nextProps, 'selectedConfig.data.places', {}))
      .keys().first().value()
    ;
    console.log(this.defaultPlace);
    const state = this.loadState(this.state, false);
    if (!_.isEqual(state, this.state)) {
      this.state = state;
    }
  }

  loadState(state, setState=true) {
    const noneDropdownSelected = _.chain(state)
      .pick(['place', 'abbr', 'year']).every((v)=>!v).value()
    ;
    if (noneDropdownSelected) {
      state = {
        ...state,
        place: this.defaultPlace,
      }
    }
    if (setState) {
      this.setState(state);
    }
    return state;
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
    if (state.place !== '') {
      data = _.groupBy(data.places[state.place], 'abbr');
      chartData.lines = _.map(data, function(rows) {
        return _.map(rows, (d) => [d.year, d.value]);
      });
      chartData.bars = [];
    } else if (state.abbr !== '') {
      data = _.groupBy(data.abbrs[state.abbr], 'place');
      chartData.lines = _.map(data, function(rows) {
        return _.map(rows, (d) => [d.year, d.value]);
      });
      chartData.bars = [];
    } else if (state.year !== '') {
      data = _.groupBy(data.years[state.year], 'abbr');
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

  selectPlace(place) {
    this.loadState({place: place, year: '', abbr: ''});
  }

  selectYear(year) {
    this.loadState({ place: '', year: year, abbr: '', });
  }

  selectAbbr(abbr) {
    this.loadState({ place: '', year: '', abbr: abbr, });
  }

  render() {
    const { 
      data,
      config: chartConfig,
    } = this.props.selectedConfig || {};

    const {
      places, years, abbrs, objects,
    } = data || {};

    let placesOptions = _.map(_.keys(places), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    let yearsOptions = _.map(_.keys(years), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));
    let abbrsOptions = _.map(_.keys(abbrs), (k, i) => (
      <option key={i} value={k}>{k}</option>
    ));

    return (
      <div className={
        'viewer ' + (_.isEmpty(chartConfig) ? 'invisible' : '')
      }>
        <div className="nav">
          <Input type="select" label="Place: "
            value={this.state.place}
            onChange={(e) => this.selectPlace(e.target.value)}
          >
            <option value="">All</option>
            {placesOptions}
          </Input>
          <Input type="select" label="Year: "
            value={this.state.year}
            onChange={(e) => this.selectYear(e.target.value)}
          >
            <option value="">All</option>
            {yearsOptions}
          </Input>
          <Input type="select" label="Indicator: "
            value={this.state.abbr}
            onChange={(e) => this.selectAbbr(e.target.value)}
          >
            <option value="">All</option>
            {abbrsOptions}
          </Input>
        </div>
        {this.renderChart()}
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



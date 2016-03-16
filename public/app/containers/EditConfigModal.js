import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Input } from 'react-bootstrap';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import reactMixin from 'react-mixin';
import Actions from '../actions';

function loadData(props) {
  const {
    selectedConfig: {
      config: chartConfig,
      data,
    }, 
  } = props;

  const abbrs = {};
  const places = {};
  _.each(data, function(d) {
    if (_.trim(d.abbr) !== '' && !abbrs[d.abbr]) {
      abbrs[d.abbr] = {energy: d.energy, unit: d.unit};
    }
    places[d.place] = null;
  });

  return {
    ...chartConfig,
    name: chartConfig.name || (chartConfig.type || 'line-chart-1'),
    formulas: chartConfig.formulas || '',
    xAxis: chartConfig.xAxis || 'year',
    abbrs: _.keys(abbrs),
    places: _.keys(places),
  };
}

class EditConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = loadData(props);
  }

  componentWillReceiveProps(nextProps) {
    this.state = {
      ...loadData(nextProps),
    };
  }

  onVariableChange(event) {
    let variable = this.state.variable;
    this.setState({
      variable: _.assign(
        {}, variable, {formula: event.target.value}
      ),
    });
  }

  selectType(event) {
    this.setState({type: event.target.value});
  }

  selectPlace(event) {
    let selectedPlaces = [];
    _.each(event.target.children, function(option) {
      if (option.selected)  {
        selectedPlaces.push(option.value);
      }
    });
    this.setState({
      place: selectedPlaces,
    });
  }

  onSave() {
    const state = this.state;
    const selectedConfig = this.props.selectedConfig;

    let years = _.map(year.split(','), function(d) {
      return _.map(d.split('-'), parseInt);
    });

    this.props.actions.saveConfig({
      ...selectedConfig.config,
      ..._.pick(this.state, [
        'name', 'type', 'year', 'place', 'energy', 'xAxis', 'formulas',
      ])
    });
  }

  onClose() {
    this.props.actions.showEditCSVModal(false);
  }

  render() {
    const {
      actions, showEditCSVModal, 
      selectedConfig: {
        config: chartConfig,
        data,
      }, 
    } = this.props;
     
    const {
      abbrs, places,
    } = this.state;

    const placesOptions = _.map(places, function(place, i) {
      return <option key={i} value={place}>{place}</option>;
    });
    

    const customVarLabel = `Custom Variables:
      ${abbrs.join(' ')}`;
    return (      
      <Modal show={showEditCSVModal} bsSize="large">
        <Modal.Header>
          <Modal.Title>Edit Config: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <Input type="text" label="Config Name: " 
                placeholder="" 
                valueLink={this.linkState('name')}/>
            </div>
            <Input type="select" label="Type: "
              value={this.linkState('type').value}
              onChange={this.selectType.bind(this)}
            >
              <option value="line-chart">Line Chart</option>
              <option value="bar-chart">Bar Chart</option>
            </Input>
          </div>
          <div>
            <Input type="text" label="Years: " 
              placeholder="1980, 2002-2010, ..." 
              valueLink={this.linkState('year')}/>
          </div>
          <div>
            <Input type="select" label="Places: " 
              value={this.state.place}
              onChange={this.selectPlace.bind(this)}
              multiple
            >
              {placesOptions}
            </Input>
          </div>
          <div>
            <Input type="text" label="Output Variables: " 
              placeholder="POP, EI, ..." 
              valueLink={this.linkState('energy')}/>
          </div>
          /*
          <div>
            <Input type="select" label="X Axis: " placeholder="year"
              valueLink={this.linkState('xAxis')}
            >
              <option value="year">Year</option>
              <option value="place">Place</option>
              <option value="energy">Energy</option>
            </Input>
          </div>
          */
          <div>
            <Input type="textarea" label={customVarLabel} 
              placeholder="POP2 = POP * 2"
              valueLink={this.linkState('formulas')}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onSave.bind(this)}
            bsStyle="primary"
          >Save</Button>
          <Button
            onClick={this.onClose.bind(this)}
          >Close</Button>
        </Modal.Footer>
      </Modal>
    )
  } 
}
reactMixin(EditConfigModal.prototype, LinkedStateMixin);

const mapStateToProps = (state) => {
  return _.pick(state, ['selectedConfig', 'showEditCSVModal']);
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditConfigModal);



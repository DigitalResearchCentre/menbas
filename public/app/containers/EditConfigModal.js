import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Input } from 'react-bootstrap';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import reactMixin from 'react-mixin';
import Actions from '../actions';


function loadData(props) {
  const config = _.get(props, 'selectedConfig.config', {}) || {};
  let {
    years,
    abbrs,
    places,
  } = config;

  console.log(config);

  return {
    ...config,
    years: _.map(years || [], function(range) {
      return range.length === 2 ? `${range[0]}-${range[1]}` : `${range[0]}`;
    }).join(', '),
    abbrs: '',
    places: places || [],
  };
}

class EditConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = loadData(props);
  }

  componentWillReceiveProps(nextProps) {
    this.state = loadData(nextProps);
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
      places: selectedPlaces,
    });
  }

  onSave() {
    const state = this.state;
    const selectedConfig = this.props.selectedConfig;

    let years = _.map(state.years.split(','), function(d) {
      return _.map(d.split('-'), parseInt);
    });

    this.props.actions.saveConfig({
      ...selectedConfig.config,
      ..._.pick(state, [
        'name', 'places', 'xAxis', 'formulas',
      ]),
      years: years,
      abbrs: _.map(state.abbrs.split(','), (abbr) => _.trim(abbr)),
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
      }, 
    } = this.props;

    const abbrs = _.keys(_.get(this.props, 'selectedFile.data.abbrs', {}));

    const placesOptions = _.map(this.state.places, function(place, i) {
      return <option key={i} value={place}>{place}</option>;
    });

    console.log(this.state);
    const customVarLabel = `Custom Variables: ${abbrs.join(' ')}`;
    return (      
      <Modal show={showEditCSVModal} bsSize="large">
        <Modal.Header>
          <Modal.Title>Edit Config: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Input type="text" label="Name: " 
              placeholder="" 
              valueLink={this.linkState('name')}/>
          </div>
          <div>
            <Input type="text" label="Years: " 
              placeholder="1980, 2002-2010, ..." 
              valueLink={this.linkState('years')}/>
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
            <Input type="text" label="Indicators: " 
              placeholder="POP, EI, ..." 
              valueLink={this.linkState('abbrs')}/>
          </div>
          <div>
            <Input type="textarea" label={customVarLabel} 
              placeholder="POP2 = POP * 2;"
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
  return _.pick(state, [
    'selectedFile', 'selectedConfig', 'showEditCSVModal'
  ]);
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

          /*
          <div>
            <Input type="select" label="Type: "
              value={this.linkState('type').value}
              onChange={this.selectType.bind(this)}
            >
              <option value="line-chart">Line Chart</option>
              <option value="bar-chart">Bar Chart</option>
            </Input>
          </div>

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


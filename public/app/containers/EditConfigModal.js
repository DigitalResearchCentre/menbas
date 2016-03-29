import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Input, Alert } from 'react-bootstrap';
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

  return {
    ...config,
    years: years || [],
    abbrs: abbrs || [],
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

  onRemove() {
    const props = this.props;
    if (confirm('Are you sure you want to remove this config file ?')) {
      props.actions.removeConfig(props.selectedConfig.config);
    }
  }

  onSave() {
    const state = this.state;
    const selectedConfig = this.props.selectedConfig;
    const { places, years, abbrs } = selectedConfig.config;
    if (!_.trim(state.name)) {
      this.setState({
        error: 'Name can not be empty',
      });
      return;
    }

    this.props.actions.saveConfig({
      ...selectedConfig.config,
      ..._.pick(state, [
        'name', 'formulas',
      ]),
      places: places,
      years: years,
      abbrs: abbrs,
    });
    if (state.error) {
      this.setState({error: ''});
    }
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

    const fileData = _.get(this.props, 'selectedFile.data') || {};
    const abbrs = _.keys(fileData.abbrs);

    const customVarLabel = `Custom Variables: ${abbrs.join(' ')}`;
    let error;
    if (this.state.error) {
      error = <Alert bsStyle="warning">{this.state.error}</Alert>;
    }
    return (      
      <Modal 
        show={showEditCSVModal} bsSize="large" 
        onHide={this.onClose.bind(this)}
        keyboard>
        <Modal.Header closeButton>
          <Modal.Title>Edit Config: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error}
          <div>
            <Input type="text" label="Name: " 
              placeholder="" 
              valueLink={this.linkState('name')}/>
          </div>
          <div>
            <Input type="textarea" label={customVarLabel} 
              placeholder="POP2 = POP * 2;"
              valueLink={this.linkState('formulas')}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" className="pull-left"
            onClick={this.onRemove.bind(this)}
          >Remove</Button>
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


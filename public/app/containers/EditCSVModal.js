import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Input } from 'react-bootstrap';
import Actions from '../actions';

class EditCSVModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSave() {
    this.props.actions.updateFormula(this.state.variable);
  }

  onVariableChange(event) {
    let variable = this.state.variable;
    this.setState({
      variable: _.assign(
        {}, variable, {formula: event.target.value}
      )
    });
  }

  onClose() {
    this.props.actions.showEditCSVModal(false);
  }

  render() {
    const { actions, showEditCSVModal, selectedFile } = this.props;
    const variable = this.state.variable;
    let variables, variableInput;

    if (variable) {
      let foo = selectedFile._energies[selectedFile.energies[variable.abbr]];
      
      variableInput = (
        <div>
          <Input 
            value={
              variable.formula === void(0) ? foo.formula : variable.formula
            }
            onChange={this.onVariableChange.bind(this)}
            type="text" label={variable.abbr} placeholder="Enter Formula" />
        </div>
      );
    }


    if (selectedFile) {
      variables = _.map(selectedFile.energies, (name, abbr)=>(
        <li key={abbr}><a onClick={()=>{
          let variable = this.state.variable;
          this.setState({
            variable: {abbr: abbr, formula: abbr},
          });
        }}>{name}: {abbr}</a></li>
      ));
    }

    return (
      <Modal show={showEditCSVModal} bsSize="large">
        <Modal.Header>
          <Modal.Title>Edit Config: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="dropdown">
            <button 
              className="btn btn-default dropdown-toggle" 
              type="button" id="ddLabel" 
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              Edit Formula
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="ddLabel">
              <li><a>Add new variable</a></li>
              <li role="separator" className="divider"></li>
              {variables}
            </ul>
          </div>
          {variableInput}
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

const mapStateToProps = (state) => {
  return _.pick(state, ['selectFile', 'showEditCSVModal']);
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCSVModal);



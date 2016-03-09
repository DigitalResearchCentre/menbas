import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import Actions from '../actions';

class EditCSVModal extends Component {
  onSave() {
  }

  render() {
    const { actions, showEditCSVModal, selectedFile } = this.props;

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
              <li><a>foo</a></li>
              <li><a>bar</a></li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onSave.bind(this)}
            bsStyle="primary"
          >Save</Button>
        </Modal.Footer>
      </Modal>
    )
  } 
}

const mapStateToProps = (state) => {
  return state.ui;
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



import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import Actions from '../actions';

class UploadCSVModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick() {
    this.props.actions.uploadCSV(this.state.file);
  }

  onFileChange(event) {
    let reader = new FileReader()
      , file = event.target.files[0]
    ;
    reader.onload = (evt) => this.setState({
      file: {
        name: file.name,
        content: evt.target.result,
      }
    });
    reader.readAsText(file);
  }

  render() {
    const { actions, showUploadCSVModal } = this.props;

    return (
      <Modal show={showUploadCSVModal}>
        <Modal.Header>
          <Modal.Title>Upload CSV File: </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={this.onFileChange.bind(this)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onClick.bind(this)}
            bsStyle="primary"
          >Upload</Button>
        </Modal.Footer>
      </Modal>
    )
  } 
}

const mapStateToProps = (state) => {
  return state.of([
    'showUploadCSVModal',
  ]).toObject();
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadCSVModal);



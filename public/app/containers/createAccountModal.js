import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import reactMixin from 'react-mixin';
import { Modal, Button } from 'react-bootstrap';
import Actions from '../actions';

class CreateAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit($event) {
    const { username, password, password2 } = this.state;
    $event.preventDefault();
    if(password === password2) {
      //this.props.actions.createAccount(username, password);
      this.props.actions.createAccount(username, password);
    }
  }
  closeWindow($event) {
    $event.preventDefault();
    this.props.actions.showCreateAccountModal(false);
  }

  render() {
    const { user, actions, showCreateAccountModal } = this.props;

    return (
      <Modal show={showCreateAccountModal}>
        <Modal.Header>
          <Modal.Title>Create Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.onSubmit.bind(this)}>
            <div>
              <label>Username: </label>
              <input type="text" valueLink={this.linkState('username')}/>
            </div>
            <div>
              <label>Password: </label>
              <input type="password" valueLink={this.linkState('password')}/>
            </div>
            <div>
              <label>Password: </label>
              <input type="password" valueLink={this.linkState('password2')}/>
            </div>
            <input type="submit" className="hidden"/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onSubmit.bind(this)}
            bsStyle="primary"
          >Create</Button>&nbsp;&nbsp;
          <Button
            onClick={this.closeWindow.bind(this)}
            bsStyle="primary"
          >Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
reactMixin(CreateAccountModal.prototype, LinkedStateMixin);

const mapStateToProps = (state) => {
  return _.pick(state, ['showCreateAccountModal']);
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccountModal);

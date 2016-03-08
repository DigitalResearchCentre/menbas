import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import reactMixin from 'react-mixin';
import { Modal, Button } from 'react-bootstrap';
import Actions from '../actions';

class LoginModal extends Modal {

  onSignInClick() {
    const { username, password } = this.state;
    this.props.actions.login(username, password);
  }

  render() {
    const { user, actions } = this.props;

    return (
      <Modal show={!user}>
        <Modal.Header>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Username: </label>
            <input type="text" valueLink={this.linkState('username')}/>
          </div>
          <div>
            <label>Password: </label>
            <input type="password" valueLink={this.linkState('password')}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSignInClick.bind(this)}>Sign In</Button>
        </Modal.Footer>
      </Modal>
    )
  } 
}
reactMixin(LoginModal.prototype, LinkedStateMixin);

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);



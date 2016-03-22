import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import reactMixin from 'react-mixin';
import { Modal, Button } from 'react-bootstrap';
import Actions from '../actions';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit($event) {
    const { username, password } = this.state;
    $event.preventDefault();
    this.props.actions.login(username, password);
  }

  render() {
    const { user, actions, children } = this.props;

    return (
      <Modal show={!user}>
        <Modal.Header>
          <Modal.Title>Sign In</Modal.Title>
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
            <input type="submit" className="hidden"/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.onSubmit.bind(this)}
            bsStyle="primary"
          >Sign In</Button>
        </Modal.Footer>
      </Modal>
    )
  } 
}
reactMixin(LoginModal.prototype, LinkedStateMixin);

const mapStateToProps = (state) => {
  return _.pick(state, ['user']);
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



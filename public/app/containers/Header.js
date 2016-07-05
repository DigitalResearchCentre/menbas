import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from '../actions';


const Header = ({actions, user}) => {
  let cb = (
      <div className="item" onClick={() => actions.showCreateAccountModal(true)}>
        Create Account
      </div>
    )
  return (
    <div className="header">
      <div className="left">
        <div className="item" onClick={() => actions.showUploadCSVModal(true)}>
          Upload CSV
        </div>
        {user && user.username === 'jin' ? cb : ''}
      </div>
      <div className="right">
        <div className="item">
          {user ? user.username : ''}
        </div>
      </div>
    </div>
  );
};

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
)(Header);

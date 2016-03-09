import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from '../actions';


const Header = ({actions, user}) => {
  return (
    <div>
      <div className="left">
        <div className="item" onClick={() => actions.showUploadCSVModal(true)}>
          Upload CSV
        </div>
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
)(Header);



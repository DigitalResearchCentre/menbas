import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from '../actions';

import Header from '../containers/Header';

const Sidebar = () => (<div/>);
const Viewer = () => (<div/>);

const App = function() {
  return (
    <div>
      <Header/>
      <div className="container">
        <Sidebar/>
        <Viewer/>
      </div>
      <LoginModal *ngIf="!state.user"/>
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
)(App);




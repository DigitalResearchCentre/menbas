import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Actions from '../actions';
import LineChart from '../components/LineChart';


class Viewer extends Component {
  onEdit(file) {
    this.props.actions.selectFile(file);
    this.props.actions.showEditCSVModal(true);
  }

  onSelect(file) {
    this.props.actions.selectFile(file);
  }

  render() {
    const { files, selectedFile } = this.props;

    return (
      <div className="viewer">
        <LineChart file={selectedFile}/>
      </div>
    );
  }
}

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
)(Viewer);



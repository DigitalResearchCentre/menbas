import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Actions from '../actions';


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
    let items = _.map(files, (file, i) => {
      return (
        <li 
          key={i}
          className={'item ' + (selectedFile === file ? 'selected' : '')}>
          <a onClick={this.onSelect.bind(this, file)}>{file.name}</a>
          
          <span 
            onClick={this.onEdit.bind(this, file)}
            className="glyphicon glyphicon-edit icon" aria-hidden="true"></span>
        </li>
      );
    });

    return (
      <div className="viewer">
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



import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Actions from '../actions';


class Sidebar extends Component {
  onEdit() {
    this.props.actions.editFile(file);
  }

  onSelect(file) {
    this.props.actions.selectFile(file);
  }

  render() {
    const { files } = this.props;
    let items = _.map(files, function(file) {
      return (
        <li onClick={this.onSelect.bind(this, file)}
          className={item + (selectedFile === file ? 'selected' : '')}>
          <a>{file.name}</a>
          <span 
            onclick={this.onEdit.bind(this, file)}
            class="glyphicon glyphicon-edit" aria-hidden="true"></span>
        </li>
      );
    });

    return (
      <ul>
        {items}
      </ul>
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
)(Sidebar);



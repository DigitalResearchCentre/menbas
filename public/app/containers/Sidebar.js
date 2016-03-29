import React, { PropTypes, Component } from 'react';
import update from 'react-addons-update';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Actions from '../actions';


class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: _.map(props.files, function(file) {
        return {
          expand: false,
          file: file,
        }
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    let items = this.state.items;
    this.setState({
      items: _.map(nextProps.files, function(file, i) {
        return {
          ...items[i],
          file: file,
        };
      }),
    });
  }

  editConfig(chartConfig) {
    this.props.actions.showEditCSVModal(true);
    this.props.actions.selectConfig(chartConfig);
  }

  addConfig(file) {
    this.props.actions.showEditCSVModal(true);
    this.props.actions.selectConfig({
      file: file.name,
    });
  }

  selectConfig(chartConfig) {
    this.props.actions.selectConfig(chartConfig);
  }

  toggleItem(item, i) {
    const { actions } = this.props;
    this.setState({
      items: update(this.state.items, {[i]: {
        expand: {$set: !item.expand},
      }}),
    }, function() {
      actions.selectConfig({
        file: item.file.name,
      });
    });
  }

  render() {
    const {
      configs, selectedFile, 
      selectedConfig = {}
    } = this.props;
  
    let lis = _.map(this.state.items, (item, i) => {
      let fileConfigs = _.map(
        _.filter(configs, {file: item.file.name}),
        (chartConfig, j) => {
          return (
            <li key={j} className={
              (chartConfig.name === selectedConfig.config.name 
               && chartConfig.file === selectedConfig.config.file)
                ? 'selected' : ''
            } >
              <a onClick={()=>this.selectConfig(chartConfig)}>
                {chartConfig.name}</a>
              <span 
                onClick={this.editConfig.bind(this, chartConfig)}
                className="edit-config-icon"
                aria-hidden="true">
              </span>
            </li>
          )
        }
      );
      return (
        <li key={i}
          className={
            'item ' + (item.expand ? '' : 'tc-collapse ') +
            (item.file._id === (selectedFile || {})._id ? 'selected ' : '')
          }>
          <a onClick={this.toggleItem.bind(this, item, i)}>
            <span className="tree-toggle icon" aria-hidden="true"></span>
            {item.file.name}
          </a>
          <ul>
            {fileConfigs}
          </ul>
        </li>
      );
    });

    return (
      <div className="sidebar">
        <ul>
          {lis}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return _.pick(state, [
    'selectedFile', 'selectedConfig', 'files', 'configs']);
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



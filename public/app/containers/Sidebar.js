import React, { PropTypes, Component } from 'react';
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

  toggleItem(item) {
    this.props.actions.selectItem(item);
    this.setState({
      items: _.map(this.state.items, function(_item) {
        if (_item === item) {
          return {
            ...item,
            expand: !item.expand,
          };
        }
        return _item;
      }),
    });
  }

  render() {
    const { configs, selectedFile } = this.props;
  
    let lis = _.map(this.state.items, (item, i) => {
      let fileConfigs = _.map(
        _.filter(configs, {file: item.file.name}),
        (chartConfig, j) => {
          return (
            <li key={j}>
              <a onClick={()=>this.selectConfig(chartConfig)}>
                {chartConfig.name}</a>
              <span 
                onClick={this.editConfig.bind(this, chartConfig)}
                className="glyphicon glyphicon-edit icon"
                aria-hidden="true">
              </span>
            </li>
          )
        }
      );
      return (
        <li key={i}
          className={
            'item ' + (selectedFile === item.file ? 'selected' : '') 
            + (item.expand ? '' : 'tc-collapse')
          }>
          <a onClick={this.toggleItem.bind(this, item)}>
            <span className="tree-toggle icon" aria-hidden="true"></span>
            {item.file.name}
          </a>
          <span 
            onClick={this.addConfig.bind(this, item.file)}
            className="glyphicon glyphicon-plus-sign icon" aria-hidden="true">
          </span>
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
  return _.pick(state, ['selectedFile', 'files', 'configs']);
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



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
        <LineChart data={{
          labels: [
            'hello', 'world',
          ],
          lines: [
            [[1985, 3000], [2000, 6000]],
            [[1999, 1500], [2005, 4000]],
            [[1997, 2500], [2004, 5000]],
          ]
        }}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return _.pick(state, [ 'files', 'selectedFile' ]);
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

/*
['', '', '', 'USA'],
['', '', '', 'Stevens'],
function transform(data) {
  // if line

  // x
  data = _.filter(data, function(d) {
    return true;
  });
  _.each(data, function(d) {
    foo.labels.push(d.bar);
    foo.lines.push([d.year, d.energy]);
  });
  { 
    labels: [
      'a',
    ]
    lines: [
      [0, 0]
    ]
  }
  // if flow
  {
    labels: ['EA'],
    flows: [

    ]
  }

  
}

*/

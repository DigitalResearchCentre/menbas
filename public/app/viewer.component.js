var ViewerComponent = ng.core.Component({
  selector: 'x-viewer',
  templateUrl: '/app/viewer.html',
  directives: [
  ],
}).Class({
  constructor: [function() {
  //, LineChart = require('./linechart')
  //, MyChart = require('./mychart')
  //, d3 = require('d3')

  }],
});

module.exports = ViewerComponent;

/*

var Viewer = React.createClass({
  componentDidMount: function() {
    var self = this;
    Dispatcher.viewer$.subscribe(function(file) {
      self.setState({
        file: file,
      });
      self.setState({type: null});
    });
  },
  getInitialState: function() {
    return {
    };
  },
  onTypeChange: function(e) {
    this.setState({type: e.target.value});
  },
  render: function() {
    var state = this.state
      , file = state.file
      , type = state.type
      , select, chart
    ;
    if (file) {
      var types = _.map(file.types, function(path, type) {
        return (
          <option value={type}>{type}</option>
        );
      });
      if (type === 'linechart') {
        chart = <LineChart/>;
      } else if (type === 'energy') {
        chart = <MyChart/>;
      }
      select = <select onChange={this.onTypeChange}>{types}</select>;
    }

    return (
      <div className="viewer">
        {select}
        {chart}
      </div>
    );
  },
});
*/

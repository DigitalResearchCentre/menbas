var ViewerComponent = ng.core.Component({
  selector: 'x-viewer',
  templateUrl: '/app/components/viewer.html',
  directives: [
    //require('./linechart.component'),
    //require('./energychart.component'),
  ],
  inputs: ['file']
}).Class({
  constructor: [function() {
    this.types = ['linechart', 'energy'];
    this.type = 'linechart';
  }],
  onTypeChange: function(event) {
    this.type = event.target.value;
  },
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

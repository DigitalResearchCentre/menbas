'use strict';

require('./app.less');
var config = require('./config')
  , React = require('react')
  , d3 = require('d3')
  , _ = require('lodash')
  , LineChart = require('./linechart')
  , MyChart = require('./mychart')
  , Dispatcher = require('./dispatcher')
;

/*
d3.xhr('../data/energydata_2016_6.csv').get(function(err, resp) {
  var data = {}
    , places = data.places = {}
    , raw, header, rows, years, cur
  ;
  raw = _.map(resp.responseText.split(/[\n\r]/), function(l) {
    return l.split(',');
  });
  years = raw[2].slice(1);
  rows = raw.splice(4, 15);
  _.each(raw[1].slice(1), function(value, i) {
    if (value) {
      cur = places[value] = {};
      _.each(rows, function(r) {
        cur[r[0]] = [];
      });
    }
    if (cur){
      _.each(rows, function(r) {
        cur[r[0]].push([years[i], r[i+1]]);
      });
    }
  });

});
*/

var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        <div>Upload File</div>
        <div>Edit Formula</div>
        <div>Sign In</div>
      </div>
    );
  },
});

var Sidebar = React.createClass({
  handleClick: function(file, e) {
    e.preventDefault();
    Dispatcher.viewer$.next(file);
  },
  render: function() {
    var self = this;
    var files = this.props.files.map(function(file) {
      return (
        <li className="item" onClick={self.handleClick.bind(self, file)}>
          <a>{file.name}</a>
        </li>
      );
    });

    return (
      <div className="sidebar">
        <ul>
          {files}
        </ul>
      </div>
    );
  },
});

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

var Content = React.createClass({
  getInitialState: function() {
    return {
      files: [{
        name: 'energydata_2016_6.csv',
        types: {
          linechart: '../data/linechart1.json',
          energy: '../data/energy.json',
        },
      }, {
        name: 'test.csv',
        types: {
          linechart: '../data/linechart1.json',
          energy: '../data/energy.json',
        },
      }],
    };
  },
  render: function() {
    return (
      <div className="content">
        <Sidebar files={this.state.files}/>
        <Viewer/>
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <Header/>
        <Content/>
      </div>
    );
  },
});

React.render(
  <App></App>,
  document.body
);



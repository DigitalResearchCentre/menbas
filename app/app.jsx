'use strict';

var React = require('react');

var data = [
  {author: 'Foo Bar', text: 'one'},
  {author: 'Hello Bar', text: '*two*'},
];

var TestList = React.createClass({
  render: function() {
    var tests = this.props.data.map(function(test, i) {
      return (
        <Test author={test.author} key={i}>{test.text}</Test>
      );
    });
    return (
      <div className="list">
        Hello world, I am a list.
        {tests}
      </div>
    );
  },
});

var TestForm = React.createClass({
  render: function() {
    return (
      <div className="form">
        Hello world, I am a form.
      </div>
    );
  },
});

var Test = React.createClass({
  render: function() {
    return (
      <div className="test">
        <h2 className="author">{this.props.author}</h2>
        {this.props.children}
      </div>
    );
  },
});

var TestBox = React.createClass({
  render: function() {
    return (
      <div className="testBox">
        hello world
        <TestList data={this.props.data}/>
        <TestForm/>
      </div>
    );
    
  }
});

React.render(
  <TestBox data={data}/>,
  document.getElementById('content')
);



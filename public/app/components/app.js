import React from 'react';
import Header from '../containers/Header';
import Sidebar from '../containers/Sidebar';
import Viewer from '../containers/Viewer';
import LoginModal from '../containers/LoginModal';
import UploadCSVModal from '../containers/UploadCSVModal';
import EditCSVModal from '../containers/EditCSVModal';

const App = () => (
  <div className="app">
    <Header/>
    <div className="body-container">
      <Sidebar/>
      <Viewer/>
    </div>
    <LoginModal/>
    <UploadCSVModal/>
    <EditCSVModal/>
  </div>
);

export default App;


/*
    var a = {
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




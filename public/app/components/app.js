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


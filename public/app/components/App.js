import React from 'react';
import Header from '../containers/Header';
import Sidebar from '../containers/Sidebar';
import Viewer from '../containers/Viewer';
import LoginModal from '../containers/LoginModal';
import UploadCSVModal from '../containers/UploadCSVModal';
import EditConfigModal from '../containers/EditConfigModal';

const App = () => (
  <div className="app">
    <Header/>
    <div className="body-container">
      <Sidebar/>
      <Viewer/>
    </div>
    <LoginModal/>
    <UploadCSVModal/>
    <EditConfigModal/>
  </div>
);

export default App;


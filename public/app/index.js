import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import App from './components/App';
require('bootstrap');
require('./components/app.less');

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);



var Immutable = require('immutable');

window.Immutable = Immutable;


import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//import api from './middleware/api';
import rootReducer from './reducers';

const _initialState = {
  user: null,
  files: [],
  selectedFile: null,
  ui: {
    showUploadCSVModal: false,
    showEditCSVModal: false,
  },
};

export default function configureStore(initialState=_initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? 
        window.devToolsExtension() : 
        function(f) {return f;}
    )
  );
};


import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import Actions from './actions';

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
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? 
        window.devToolsExtension() : 
        function(f) {return f;}
    )
  );

  store.dispatch(Actions.checkAuth());

  return store;
};


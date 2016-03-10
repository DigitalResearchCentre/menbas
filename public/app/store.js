import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import Actions from './actions';
import initialState from './initialState';

export default function configureStore() {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ?  window.devToolsExtension() : e => e
    )
  );

  store.dispatch(Actions.checkAuth());

  return store;
};


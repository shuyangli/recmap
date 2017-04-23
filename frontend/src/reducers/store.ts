import { createStore } from 'redux';

import defaultReducer from './reducer';

const reduxDevtoolsExtension: any = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

const store = createStore(defaultReducer,
  reduxDevtoolsExtension && reduxDevtoolsExtension()
);
export default store;
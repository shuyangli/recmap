import { createStore } from 'redux';

import { LocationState, reducer } from './reducer';

const reduxDevtoolsExtension: any = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export const store = createStore(reducer,
  reduxDevtoolsExtension && reduxDevtoolsExtension()
);
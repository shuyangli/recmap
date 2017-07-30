import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { LocationState } from './locations/types';
import { locationsReducer } from './locations/reducer';
import { ActionPanelState } from './actionPanel/types';
import { actionPanelReducer } from './actionPanel/reducer';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface RootState {
  location: LocationState;
  actionPanel: ActionPanelState;
};

export const reducer = combineReducers({
  location: locationsReducer,
  actionPanel: actionPanelReducer
});

export const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(thunkMiddleware)
  )
);

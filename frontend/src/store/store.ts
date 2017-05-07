import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { locationsReducer, LocationState } from './reducers/locationsReducer';
import { actionPanelReducer, ActionPanelState } from './reducers/actionPanelReducer';

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

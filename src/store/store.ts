import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { actionPanelReducer } from "./actionPanel/reducer";
import { ActionPanelState } from "./actionPanel/types";
import { locationsReducer } from "./locations/reducer";
import { LocationState } from "./locations/types";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface RootState {
  location: LocationState;
  actionPanel: ActionPanelState;
}

export const reducer = combineReducers({
  location: locationsReducer,
  actionPanel: actionPanelReducer,
});

export const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(thunkMiddleware),
  ),
);

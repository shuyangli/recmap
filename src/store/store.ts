import { combineReducers, loggingMiddleware, reduceCompoundActions } from "redoodle";
import { applyMiddleware, compose, createStore, Action } from "redux";
import thunkMiddleware, { ThunkDispatch } from "redux-thunk";

import { actionPanelReducer } from "./actionPanel/actions";
import { EMPTY_ACTION_PANEL_STATE, ActionPanelState } from "./actionPanel/types";
import { locationsReducer } from "./locations/actions";
import { EMPTY_LOCATION_STATE, LocationState } from "./locations/types";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface RootState {
  location: LocationState;
  actionPanel: ActionPanelState;
}

const initialState: RootState = {
  location: EMPTY_LOCATION_STATE,
  actionPanel: EMPTY_ACTION_PANEL_STATE,
};

export const reducer = combineReducers({
  location: locationsReducer,
  actionPanel: actionPanelReducer,
});

export const store = createStore(
  reduceCompoundActions(reducer),
  initialState,
  composeEnhancers(
    applyMiddleware<ThunkDispatch<RootState, void, Action>>(
      thunkMiddleware,
      loggingMiddleware({ enableInProduction: false }),
    ),
  ),
);

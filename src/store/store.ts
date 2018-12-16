import { combineReducers, loggingMiddleware, reduceCompoundActions } from "redoodle";
import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware, { ThunkMiddleware } from "redux-thunk";

import { actionPanelReducer } from "./actionPanel/actions";
import { locationsReducer } from "./locations/actions";
import { initialState, RootState } from "./RootState";

const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reducer = combineReducers({
  location: locationsReducer,
  actionPanel: actionPanelReducer,
});

export const store = createStore(
  reduceCompoundActions(reducer),
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware as ThunkMiddleware<RootState>,
      loggingMiddleware({ enableInProduction: false }),
    ),
  ),
);

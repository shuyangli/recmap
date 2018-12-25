import { combineReducers, loggingMiddleware, reduceCompoundActions } from "redoodle";
import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { actionPanelReducer } from "./actionPanel/actions";
import { locationsReducer } from "./locations/actions";
import { initialState } from "./RootState";
import { mapsApi } from "../api/MapsApi";
import { ApplicationApi } from "../api/ApplicationApi";
import { BackendApi } from "../api/BackendApi";
import { FirebaseApi } from "../api/FirebaseApi";
import { firebaseConfig, googleMapsApiKey } from "../config";

const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reducer = combineReducers({
  location: locationsReducer,
  actionPanel: actionPanelReducer,
});

export async function createApplicationStore() {
  await mapsApi.initialize(googleMapsApiKey);
  const backendApi: BackendApi = new FirebaseApi(firebaseConfig);
  const applicationApi: ApplicationApi = {
    mapsApi,
    backendApi,
  };

  const store = createStore(
    reduceCompoundActions(reducer),
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware.withExtraArgument(applicationApi),
        loggingMiddleware({ enableInProduction: false }),
      ),
    ),
  );
  return store;
}

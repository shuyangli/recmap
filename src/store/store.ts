import { combineReducers, loggingMiddleware, reduceCompoundActions } from "redoodle";
import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { actionPanelReducer } from "./actionPanel/reducer";
import { locationsReducer } from "./locations/reducer";
import { initialState } from "./RootState";
import { ApplicationApi } from "../api/ApplicationApi";
import { BackendApi } from "../api/BackendApi";
import { FirebaseApi } from "../api/FirebaseApi";
import { firebaseConfig, googleMapsApiKey } from "../config";
import { GoogleMapsApi } from "../api/GoogleMapsApi";

const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reducer = combineReducers({
  location: locationsReducer,
  actionPanel: actionPanelReducer,
});

export async function createApplicationStore() {
  const mapsApi = new GoogleMapsApi(googleMapsApiKey);
  await mapsApi.initialize();
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

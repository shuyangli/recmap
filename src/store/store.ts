import { combineReducers, loggingMiddleware, reduceCompoundActions } from "redoodle";
import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { actionPanelReducer } from "./actionPanel/reducer";
import { locationsReducer } from "./locations/reducer";
import { initialState } from "./RootState";
import { ApplicationApi } from "../api/ApplicationApi";
import { BackendApi } from "../api/BackendApi";
import { ExpressApi } from "../api/ExpressApi";
import { firebaseConfig, serverConfig, googleMapsApiKey } from "../config";
import { GoogleMapsApi } from "../api/GoogleMapsApi";
import { setCurrentPositionToGeolocation, initializePresetPositions } from "./locations/actions";
import { userReducer } from "./user/reducer";
import { initFirebase, setupFirebaseObservers } from "../initFirebase";
import { initializeAuthorRecords } from "./user/actions";

const composeEnhancers: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reducer = combineReducers({
  location: locationsReducer,
  actionPanel: actionPanelReducer,
  user: userReducer,
});

export async function createApplicationStore() {
  const mapsApi = new GoogleMapsApi(googleMapsApiKey);
  await mapsApi.initialize();
  const applicationApi: ApplicationApi = {
    mapsApi,
    backendApi: undefined,
  };

  initFirebase(firebaseConfig);

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

  const authTokenProvider = () => {
    const maybeCurrentUser = store.getState().user.currentUser;
    if (maybeCurrentUser) {
      return Promise.resolve(maybeCurrentUser.getIdToken());
    } else {
      return Promise.resolve(undefined);
    }
  };

  const uidProvider = () => {
    const maybeCurrentUser = store.getState().user.currentUser;
    return maybeCurrentUser ? maybeCurrentUser.uid : undefined;
  };

  const backendApi: BackendApi = new ExpressApi(serverConfig, authTokenProvider, uidProvider);
  applicationApi.backendApi = backendApi;

  setupFirebaseObservers(store);
  store.dispatch(setCurrentPositionToGeolocation());
  store.dispatch(initializePresetPositions());
  store.dispatch(initializeAuthorRecords());
  return store;
}

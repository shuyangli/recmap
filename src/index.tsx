import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { initialize } from "./api/MapsApi";

import { App } from "./components/App";
import { store } from "./store/store";
import { updateCurrentLocation } from "./store/locations/actions";

import "./index.less";

initialize()
.then(() => ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
))
.then(() => store.dispatch(updateCurrentLocation()));

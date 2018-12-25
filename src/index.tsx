import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { App } from "./components/App";
import { createApplicationStore } from "./store/store";

import "./index.less";

createApplicationStore()
.then((store) => ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
));

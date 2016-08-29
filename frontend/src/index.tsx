import * as React from "react";
import * as ReactDOM from "react-dom";

import { TestComponent } from "./components/TestComponent";

ReactDOM.render(
  <TestComponent compiler="Typescript" framework="React" />,
  document.getElementById("root")
  );

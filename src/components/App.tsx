import * as React from "react";

import { ConnectedMap } from "./map/Map";
import { ConnectedActionPanel } from "./panel/ActionPanel";
import { ConnectedLocationSidebar } from "./sidebar/LocationSidebar";

export class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="app-viewport">
        <ConnectedMap />
        <div className="floater-viewport">
          <ConnectedLocationSidebar />
          <ConnectedActionPanel />
        </div>
      </div>
      );
  }
}

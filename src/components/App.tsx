import * as React from "react";
import { ConnectedMap } from "./map/Map";
import { ConnectedActionPanel } from "./panel/ActionPanel";
import { ConnectedLocationSidebar } from "./sidebar/LocationSidebar";
import { ConnectedUserDisplay } from "./user/UserDisplay";
import { ConnectedCurrentPositionControl } from "./user/CurrentPositionControl";

export class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="app-viewport">
        <ConnectedLocationSidebar />
        <ConnectedActionPanel />
        <div className="user-viewport">
          <ConnectedCurrentPositionControl />
          <ConnectedUserDisplay />
        </div>

        <ConnectedMap />
      </div>
      );
  }
}

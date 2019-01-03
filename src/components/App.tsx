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
        <ConnectedMap />
        <div className="columns-viewport">
          <ConnectedLocationSidebar />
          <ConnectedActionPanel />
        </div>
        <div className="user-viewport">
          <ConnectedCurrentPositionControl />
          <ConnectedUserDisplay />
        </div>
      </div>
      );
  }
}

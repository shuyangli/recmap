import * as React from 'react';

import { ConnectedLocationSidebar } from './sidebar/LocationSidebar';
import { ConnectedActionPanel } from './panel/ActionPanel';
import { ConnectedMap } from './map/Map';

export class App extends React.PureComponent<{}, void> {
  render() {
    return (
      <div className='app-viewport'>
        <ConnectedMap />
        <div className='floater-viewport'>
          <ConnectedLocationSidebar />
          <ConnectedActionPanel />
        </div>
      </div>
      );
  }
}

import * as React from 'react';
import { connect } from 'react-redux';

import { store } from '../store/store';
import { loadLocations } from '../store/actions';

import { ConnectedLocationSidebar } from './sidebar/LocationSidebar';
import { ConnectedActionPanel } from './panel/ActionPanel';
import { Map } from './map/Map';

export class App extends React.PureComponent<{}, void> {

  componentWillMount() {
    store.dispatch(loadLocations());
  }

  render() {
    return (
      <div className='app-viewport'>
        <ConnectedLocationSidebar />
        <ConnectedActionPanel />
        <Map />
      </div>
      );
  }
}

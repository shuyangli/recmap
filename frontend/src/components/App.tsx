import * as React from 'react';
import { connect } from 'react-redux';

import { store } from '../reducers/store';
import { loadLocations } from '../reducers/actionTypes';

import { ConnectedLocationsSidebar } from './sidebar/LocationsSidebar';

export class App extends React.PureComponent<{}, void> {

  componentWillMount() {
    store.dispatch(loadLocations());
  }

  render() {
    return (
      <div>
        <ConnectedLocationsSidebar />
      </div>
      );
  }
}

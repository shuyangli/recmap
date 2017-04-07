import * as React from 'react';
import * as MapGL from 'react-map-gl';
import { fromJS } from 'immutable';

import * as config from '../config';

import { NavbarComponent } from './NavbarComponent';

export class App extends React.Component<void, void> {
  render() {
    return (
      <div>
        <NavbarComponent />
        <MapGL 
          mapboxApiAccessToken={config.mapboxApiAccessToken}
          width={700}
          height={450}
          latitude={37.78}
          longitude={-122.45}
          zoom={11}
          mapStyle={'mapbox://styles/mapbox/streets-v10'} />
      </div>
      );
  }
}

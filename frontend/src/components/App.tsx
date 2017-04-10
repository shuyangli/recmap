import * as React from 'react';
import * as MapGL from 'react-map-gl';
import { fromJS } from 'immutable';

import { mapboxApiAccessToken, firebaseConfig } from '../config';

import { NavbarComponent } from './NavbarComponent';
import { BackendApi } from '../api/BackendApi';
import { FirebaseApi } from '../api/FirebaseApi';

export class App extends React.Component<void, void> {

  api: BackendApi = new FirebaseApi(firebaseConfig);

  render() {
    return (
      <div>
        <NavbarComponent />
        <MapGL 
          mapboxApiAccessToken={mapboxApiAccessToken}
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

import * as React from 'react';
import * as MapGL from 'react-map-gl';
import * as GoogleMaps from '@google/maps';
import { fromJS } from 'immutable';

import { googleMapsApiKey, mapboxApiAccessToken, firebaseConfig } from '../config';

import store from '../reducers/store';
import { loadInitial } from '../actions/actionTypes';

import { NavbarComponent } from './NavbarComponent';
import { BackendApi } from '../api/BackendApi';
import { FirebaseApi } from '../api/FirebaseApi';

export class App extends React.Component<void, void> {

  api: BackendApi = new FirebaseApi(firebaseConfig);
  maps: any = GoogleMaps.createClient({ key: googleMapsApiKey });

  componentWillMount() {
    store.dispatch(loadInitial());
  }

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

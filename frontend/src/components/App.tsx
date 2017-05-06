import * as React from 'react';
import { connect } from 'react-redux';
// import * as MapGL from 'react-map-gl';
// import * as GoogleMaps from '@google/maps';
// import { fromJS } from 'immutable';

import { googleMapsApiKey, mapboxApiAccessToken, firebaseConfig } from '../config';

import { store } from '../reducers/store';
import { loadLocations } from '../reducers/actionTypes';

import { ConnectedLocationsSidebar } from './sidebar/LocationsSidebar';
import { BackendApi } from '../api/BackendApi';
import { FirebaseApi } from '../api/FirebaseApi';

export class App extends React.PureComponent<void, void> {

  api: BackendApi = new FirebaseApi(firebaseConfig);
  // maps: any = GoogleMaps.createClient({ key: googleMapsApiKey });

  componentWillMount() {
    store.dispatch(loadLocations());
  }

  render() {
    return (
      <div>
        <ConnectedLocationsSidebar />
        {/*<MapGL
          mapboxApiAccessToken={mapboxApiAccessToken}
          width={700}
          height={450}
          latitude={37.78}
          longitude={-122.45}
          zoom={11}
          mapStyle={'mapbox://styles/mapbox/streets-v10'} />*/}
      </div>
      );
  }
}

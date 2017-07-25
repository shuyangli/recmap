import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Location } from '../../api/interfaces';
import { getCurrentLocation, mapsDefaults } from '../../api/MapsApi';

import './Map.less'

export class Map extends React.PureComponent<{}, void> {

  private mapRef: HTMLDivElement;
  private map: any;

  componentDidMount = () => {
    // hack for loading google maps dependency in-browser
    const google = (window as any).google;

    this.map = new google.maps.Map(this.mapRef, {
      center: {
        lat: mapsDefaults.latitude,
        lng: mapsDefaults.longitude
      },
      zoom: mapsDefaults.zoom
    });
  }

  render() {
    return (
      <div id='map' ref={(element) => this.mapRef = element} />
    );
  }
}

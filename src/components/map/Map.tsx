import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Location } from '../../api/interfaces';
import { initializeMapElement, getCurrentLocation, mapsDefaults } from '../../api/MapsApi';
import { RootState } from '../../store/store';

import './Map.less'

interface ConnectedProps {
  locations: { [id: string]: Location };
}

class Map extends React.PureComponent<ConnectedProps, void> {

  private mapRef: HTMLDivElement;
  private map: any;

  componentDidMount() {
    this.map = initializeMapElement(this.mapRef);
  }

  render() {
    const google = (window as any).google;
    const markers = _.mapValues(this.props.locations, location =>
      new google.maps.Marker({
        map: this.map,
        position: {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude)
        }
      }));
    return (
      <div id='map' ref={(element) => this.mapRef = element} />
    );
  }
}

const mapStateToProps = (state: RootState): ConnectedProps => ({
  locations: state.location.locations
});

export const ConnectedMap: React.ComponentClass<{}> =
  connect(mapStateToProps)(Map as any);

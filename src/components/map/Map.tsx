import * as React from 'react';
import { connect } from 'react-redux';
import { Location } from '../../api/interfaces';
import { initializeMapElement, getCurrentLocation, mapsDefaults } from '../../api/MapsApi';
import { RootState } from '../../store/store';
import { getFilteredLocations } from '../../store/locations/selectors';

import './Map.less'

interface ConnectedProps {
  filteredLocations: Location[];
}

interface State {
  displayedMarkers: any[];
}

class Map extends React.PureComponent<ConnectedProps, State> {
  state: State = {
    displayedMarkers: []
  };

  private mapRef: HTMLDivElement;
  private map: any;

  componentDidMount() {
    this.map = initializeMapElement(this.mapRef);
  }

  componentWillReceiveProps(nextProps: ConnectedProps) {
    const google = (window as any).google;
    const newMarkers = nextProps.filteredLocations.map(location =>
      new google.maps.Marker({
        map: this.map,
        position: {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude)
        }
      }));

    this.state.displayedMarkers.forEach(marker => marker.setMap(null));
    this.setState({ displayedMarkers: newMarkers });
  }

  render() {
    const google = (window as any).google;
    return (
      <div id='map' ref={(element) => this.mapRef = element} />
    );
  }
}

const mapStateToProps = (state: RootState): ConnectedProps => ({
  filteredLocations: getFilteredLocations(state)
});

export const ConnectedMap: React.ComponentClass<{}> =
  connect(mapStateToProps)(Map as any);

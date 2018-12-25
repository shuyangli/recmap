import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Location } from "../../api/interfaces";
import { mapsApi } from "../../api/MapsApi";
import { ToggleDetailPanel } from "../../store/actionPanel/actions";
import { getFilteredLocations } from "../../store/locations/selectors";
import { RootState } from "../../store/RootState";

import "./Map.less";

interface ConnectedProps {
  filteredLocations: Location[];
}

interface DispatchProps {
  toggleDetailPanelForLocation: (locationId: string) => void;
}

interface State {
  displayedMarkers: any[];
}

class Map extends React.PureComponent<ConnectedProps & DispatchProps, State> {
  state: State = {
    displayedMarkers: [],
  };

  private mapRef: HTMLDivElement;
  private map: any;

  componentDidMount() {
    this.map = mapsApi.initializeMapElement(this.mapRef);
  }

  componentWillReceiveProps(nextProps: ConnectedProps) {
    const newMarkers = nextProps.filteredLocations.map((location) => {
      const marker: google.maps.Marker = new google.maps.Marker({
        map: this.map,
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
      marker.addListener("click", () => this.props.toggleDetailPanelForLocation(location.id));
      return marker;
    });

    this.state.displayedMarkers.forEach((marker) => marker.setMap(null));
    this.setState({ displayedMarkers: newMarkers });
  }

  render() {
    return (
      <div id="map" ref={(element) => this.mapRef = element} />
    );
  }
}

const mapStateToProps = (state: RootState): ConnectedProps => ({
  filteredLocations: getFilteredLocations(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleDetailPanelForLocation: (locationId: string) => dispatch(ToggleDetailPanel.create({ locationId })),
});

export const ConnectedMap: React.ComponentClass<{}> = connect(mapStateToProps, mapDispatchToProps)(Map as any);

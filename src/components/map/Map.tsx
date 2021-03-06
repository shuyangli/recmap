import * as React from "react";
import { connect } from "react-redux";

import { Location } from "../../api/interfaces";
import { ToggleDetailPanel } from "../../store/actionPanel/actions";
import { getActiveLocationId } from "../../store/actionPanel/selectors";
import { initializeMapElement } from "../../store/locations/actions";
import { getFilteredLocations } from "../../store/locations/selectors";
import { RootState } from "../../store/RootState";
import { TypedDispatch } from "../../store/TypedDispatch";
import "./Map.less";

interface ConnectedProps {
  filteredLocations: Location[];
  currentLocationId: string | undefined;
}

interface DispatchProps {
  toggleDetailPanelForLocation: (locationId: string) => void;
  initializeMapElement: (ref: HTMLDivElement) => google.maps.Map;
}

interface State {
  displayedMarkers: any[];
}

type MapProps = ConnectedProps & DispatchProps;

class Map extends React.PureComponent<MapProps, State> {
  state: State = {
    displayedMarkers: [],
  };

  private mapRef: HTMLDivElement;
  private map: any;

  componentDidMount() {
    this.map = this.props.initializeMapElement(this.mapRef);
  }

  componentWillReceiveProps(nextProps: MapProps) {
    const newMarkers = nextProps.filteredLocations.map((location) => {
      const opacity: number =
        nextProps.currentLocationId == null ? 1.0 :
        location.id === nextProps.currentLocationId ? 1.0 : 0.5;
      const marker: google.maps.Marker = new google.maps.Marker({
        map: this.map,
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
        opacity,
      });
      marker.addListener("click", () => nextProps.toggleDetailPanelForLocation(location.id));
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
  currentLocationId: getActiveLocationId(state),
});

const mapDispatchToProps = (dispatch: TypedDispatch): DispatchProps => ({
  toggleDetailPanelForLocation: (locationId: string) => dispatch(ToggleDetailPanel.create({ locationId })),
  initializeMapElement: (ref) => dispatch(initializeMapElement(ref)),
});

export const ConnectedMap: React.ComponentClass<{}> = connect(mapStateToProps, mapDispatchToProps)(Map);

import * as React from "react";
import { connect } from "react-redux";

import { getDistanceBetween } from "@src/api/MapsApi";
import { RootState } from "@src/store/store";

interface OwnProps {
  latitude: number;
  longitude: number;
}

interface ConnectedProps {
  currentLocation: {
    longitude: number;
    latitude: number;
  } | undefined;
}

class LocationDistance extends React.PureComponent<OwnProps & ConnectedProps, {}> {
  render() {
    if (this.props.currentLocation) {
      return (
        <div className="location-distance">
          {getDistanceBetween(
            this.props.currentLocation.latitude,
            this.props.currentLocation.longitude,
            this.props.latitude,
            this.props.longitude,
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  currentLocation: state.location.currentLocation,
});

export const ConnectedLocationDistance = connect<ConnectedProps, void, OwnProps>(mapStateToProps)(LocationDistance);

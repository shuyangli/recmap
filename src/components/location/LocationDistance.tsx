import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { getDistanceBetween } from "@src/api/MapsApi";
import { RootState } from "@src/store/store";

interface OwnProps {
  latitude: number;
  longitude: number;
}

interface ConnectedProps {
  distance: number | undefined;
}

class LocationDistance extends React.PureComponent<OwnProps & ConnectedProps, {}> {
  render() {
    if (this.props.distance) {
      return (
        <div className="location-distance">
          {this.props.distance > 1000
          ? `${(this.props.distance / 1000).toFixed(1).toString()}km`
          : `${this.props.distance.toFixed(0).toString()}m`}
        </div>
      );
    } else {
      return null;
    }
  }
}

const distanceSelectorFactory = () => createSelector(
  (state: RootState) => state.location.currentLocation,
  (state: RootState, ownProps: OwnProps) => ownProps.latitude,
  (state: RootState, ownProps: OwnProps) => ownProps.longitude,
  (currentLocation, ownLatitude, ownLongitude) => currentLocation
    ? getDistanceBetween(
        currentLocation.latitude,
        currentLocation.longitude,
        ownLatitude,
        ownLongitude,
      )
    : undefined,
);

const mapStateToPropsFactory = () => {
  const distanceSelector = distanceSelectorFactory();
  return (state: RootState, ownProps: OwnProps) => ({
    distance: distanceSelector(state, ownProps),
  });
};

export const ConnectedLocationDistance = connect<ConnectedProps, void, OwnProps>(
  mapStateToPropsFactory,
)(LocationDistance);

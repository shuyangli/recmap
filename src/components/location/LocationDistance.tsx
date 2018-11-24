import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { getDistanceBetween } from "../../api/MapsApi";
import { RootState } from "../../store/store";

interface OwnProps {
  latitude: number;
  longitude: number;
}

interface ConnectedProps {
  formattedDistance: string | undefined;
}

class LocationDistance extends React.PureComponent<OwnProps & ConnectedProps, {}> {
  render() {
    if (this.props.formattedDistance) {
      return <div className="location-distance">{this.props.formattedDistance}</div>;
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

const formattedDistanceSelectorFactory = () => createSelector(
  distanceSelectorFactory(),
  (distance) => {
    if (distance) {
      if (distance > 1000) {
        return `${(distance / 1000).toFixed(1).toString()}km`;
      } else {
        return `${distance.toFixed(0).toString()}m`;
      }
    } else {
      return undefined;
    }
  },
);

const mapStateToPropsFactory = () => {
  const formattedDistanceSelector = formattedDistanceSelectorFactory();
  return (state: RootState, ownProps: OwnProps) => ({
    formattedDistance: formattedDistanceSelector(state, ownProps),
  });
};

export const ConnectedLocationDistance = connect<ConnectedProps, void, OwnProps>(
  mapStateToPropsFactory,
)(LocationDistance);

import * as React from "react";
import { connect } from "react-redux";
import { getDistanceBetween } from "../../api/MapsApi";
import { Location } from "../../api/interfaces";
import { PositionWithMetadata } from "../../store/locations/types";
import { RootState } from "../../store/RootState";
import { currentPositionSelector } from "../../store/locations/selectors";

interface OwnProps {
  location: Location;
}

interface ConnectedProps {
  currentPosition: PositionWithMetadata;
}

type LocationDistanceProps = OwnProps & ConnectedProps;

class LocationDistance extends React.PureComponent<LocationDistanceProps, never> {
  render() {
    return (
      <div className="location-distance">
      {
        getFormattedDistance(
          this.props.location,
          this.props.currentPosition.position.latitude,
          this.props.currentPosition.position.longitude,
        )
      }
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): ConnectedProps => ({
  currentPosition: currentPositionSelector(state),
});

export const ConnectedLocationDistance = connect(mapStateToProps)(LocationDistance);

function getFormattedDistance(location: Location, currentLatitude: number, currentLongitude: number) {
  const distance = getDistanceBetween(
    location.latitude,
    location.longitude,
    currentLatitude,
    currentLongitude,
  );
  if (distance > 1000) {
    return `${(distance / 1000).toFixed(1).toString()}km`;
  } else {
    return `${distance.toFixed(0).toString()}m`;
  }
}

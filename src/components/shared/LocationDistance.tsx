import * as React from "react";
import { getDistanceBetween, getCurrentPosition } from "../../api/MapsApi";
import { Location } from "../../api/interfaces";

interface LocationDistanceProps {
  location: Location;
}

interface State {
  currentLatitude?: number;
  currentLongitude?: number;
}

export class LocationDistance extends React.PureComponent<LocationDistanceProps, State> {
  constructor(props: LocationDistanceProps) {
    super(props);
    this.state = {
      currentLatitude: undefined,
      currentLongitude: undefined,
    };
  }

  componentDidMount() {
    getCurrentPosition().then((location) => {
      this.setState({
        currentLatitude: location.coords.latitude,
        currentLongitude: location.coords.longitude,
      });
    });
  }

  render() {
    if (this.state.currentLatitude == null || this.state.currentLongitude == null) {
      return null;
    }
    return (
      <div className="location-distance">
      {
        getFormattedDistance(
          this.props.location,
          this.state.currentLatitude,
          this.state.currentLongitude,
        )
      }
      </div>
    );
  }
}

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

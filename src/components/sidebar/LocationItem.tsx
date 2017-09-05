import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Location } from "@src/api/interfaces";
import { ConnectedLocationDistance, LocationRating, LocationTags } from "@src/components/location";
import { ToggleDetailPanel } from "@src/store/actionPanel/actions";
import { RootState } from "@src/store/store";

import "./LocationItem.less";

interface OwnProps {
  location: Location;
}

interface DispatchProps {
  getOpenDetailsPanel: (locationId: string) => () => void;
}

class LocationItem extends React.PureComponent<OwnProps & DispatchProps, {}> {
  render() {
    const { location } = this.props;
    return (
      <div className="location-item" onClick={this.props.getOpenDetailsPanel(location.id)}>
        <div className="location-row-wrapper">
          <h5 className="location-name">{location.name}</h5>
          <LocationRating rating={location.rating} />
        </div>
        <div className="location-row-wrapper">
          <LocationTags tags={location.tags} />
          <ConnectedLocationDistance latitude={location.latitude} longitude={location.longitude} />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    getOpenDetailsPanel: (locationId: string) => () => dispatch(ToggleDetailPanel.create({ locationId })),
  };
}

export const ConnectedLocationItem = connect<void, DispatchProps, OwnProps>(null, mapDispatchToProps)(LocationItem);

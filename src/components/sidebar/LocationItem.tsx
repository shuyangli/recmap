import { Classes, IconClasses, Tag } from "@blueprintjs/core";
import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Location } from "@src/api/interfaces";
import { LocationRating } from "@src/components/location/LocationRating";
import { LocationTags } from "@src/components/location/LocationTags";
import { ToggleDetailPanel } from "@src/store/actionPanel/actions";
import { RootState } from "@src/store/store";

import "./LocationItem.less";

interface OwnProps {
  location: Location;
}

interface ConnectedProps {
  getOpenDetailsPanel: (locationId: string) => () => void;
}

class LocationItem extends React.PureComponent<OwnProps & ConnectedProps, void> {
  render() {
    return (
      <div className="location-item" onClick={this.props.getOpenDetailsPanel(this.props.location.id)}>

        <div className="location-name-rating-wrapper">
          <h5 className="location-name">{this.props.location.name}</h5>
          <LocationRating rating={this.props.location.rating} />
        </div>

        <LocationTags tags={this.props.location.tags} />

        <p className="location-address">{this.props.location.address}</p>

      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): ConnectedProps {
  return {
    getOpenDetailsPanel: (locationId: string) => () => dispatch(ToggleDetailPanel.create({ locationId })),
  };
}

export const ConnectedLocationItem: React.ComponentClass<OwnProps> =
  connect<ConnectedProps, void, OwnProps>(null, mapDispatchToProps)(LocationItem as any);

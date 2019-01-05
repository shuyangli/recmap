import { H2 } from "@blueprintjs/core";
import * as React from "react";
import { Location } from "../../api/interfaces";
import { LocationTags } from "../shared";

import "./LocationDetailView.less";

interface LocationDetailViewProps {
  location: Location;
  renderActions?: () => React.ReactNode;
}

export class LocationDetailView extends React.Component<LocationDetailViewProps, never> {
  render() {
    return (
      <div className="location-detail-view">
        <div className="location-entry aligned name-and-link">
          <H2 className="location-name">{this.props.location.name}</H2>
          {this.props.renderActions && (
            <div className="location-detail-view-buttons">
              {this.props.renderActions()}
            </div>
          )}
        </div>
        <div className="location-entry location-address">{this.props.location.address}</div>
        <div className="location-entry aligned">
          <LocationTags tags={this.props.location.tags} />
        </div>
      </div>
    );
  }
}

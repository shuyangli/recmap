import { Button } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Location } from "../../api/interfaces";
import { LocationRating, LocationTags } from "../../components/location";
import { ToggleEditPanel } from "../../store/actionPanel/actions";

import "./LocationDetailsPanel.less";

interface OwnProps {
  location: Location;
}

interface DispatchProps {
  onEdit: (locationId: string) => void;
}

class LocationDetailsPanel extends React.PureComponent<OwnProps & DispatchProps, void> {
  render() {
    return (
      <div className="location-panel">
        <div className="location-content-wrapper">
          <div className="location-name-wrapper">
            <h1 className="location-name">{this.props.location.name}</h1>
            <LocationRating rating={this.props.location.rating} />
          </div>

          <LocationTags tags={this.props.location.tags} />

          <p className="location-address">{this.props.location.address}</p>
          <p className="location-notes">{this.props.location.notes}</p>
        </div>

        <div className="panel-edit-controls">
          <Button text="Edit" onClick={this.onEdit} />
        </div>
      </div>
    );
  }

  private onEdit = () => this.props.onEdit(this.props.location.id);
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    onEdit: (locationId: string) => dispatch(ToggleEditPanel.create({ locationId })),
  };
}

export const ConnectedLocationDetailsPanel: React.ComponentClass<OwnProps> =
  connect<void, DispatchProps, OwnProps>(null, mapDispatchToProps)(LocationDetailsPanel as any);

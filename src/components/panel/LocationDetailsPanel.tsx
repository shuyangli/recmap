import { Button, H2 } from "@blueprintjs/core";
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
          <H2 className="location-name">{this.props.location.name}</H2>
          <div className="location-address">{this.props.location.address}</div>

          <LocationRating rating={this.props.location.rating} />
          <LocationTags tags={this.props.location.tags} />

          {this.props.location.notes.notes && (
            <p className="location-notes">{this.props.location.notes.notes}</p>
          )}
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

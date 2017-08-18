import { Button, Tag } from "@blueprintjs/core";
import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Location } from "@src/api/interfaces";
import { ToggleEditPanel } from "@src/store/actionPanel/actions";
import { RootState } from "@src/store/store";

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
          <h1 className="location-name">{this.props.location.name}</h1>
          <div className="location-tag-area">
            {this.props.location.tags.map((tag: string) =>
              <Tag key={tag}>{tag}</Tag>,
            )}
          </div>
          <p className="location-address">{this.props.location.address}</p>
          <p className="location-notes">{this.props.location.notes}</p>
        </div>

        <div className="panel-edit-controls pt-elevation-1">
          <Button text="Edit" onClick={this.onEdit} />
        </div>
      </div>
    );
  }

  private onEdit = () => this.props.onEdit(this.props.location.id);
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onEdit: (locationId: string) => dispatch(ToggleEditPanel.create({ locationId })),
  };
}

export const ConnectedLocationDetailsPanel: React.ComponentClass<OwnProps> =
  connect<void, DispatchProps, OwnProps>(null, mapDispatchToProps)(LocationDetailsPanel as any);

import { Button, Intent } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Location, CreateLocationRequest } from "../../api/interfaces";
import { ClosePanel, ToggleDetailPanel, ToggleEditPanel, OpenEditReviewPanel } from "../../store/actionPanel/actions";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../store/locations/actions";
import { TypedDispatch } from "../../store/TypedDispatch";
import { RootState } from "../../store/RootState";
import {
  LocationDetailEditorState,
  ConnectedLocationDetailEditor,
  LocationDetailEditor,
} from "../editors/LocationDetailEditor";

import "./EditLocationPanel.less";

interface OwnProps {
  locationId?: string;
}

interface ConnectedProps {
  location?: Location;
}

interface DispatchProps {
  onCancel: () => void;
  onSave: (request: CreateLocationRequest) => Promise<Location>;
  onDelete: () => void;
  openDetailPanel: (locationId: string) => void;
  openEditReviewPanel: (locationId: string) => void;
}

interface State {
  locationDetail: LocationDetailEditorState;
  isSaving: boolean;
}

type EditLocationPanelProps = OwnProps & ConnectedProps & DispatchProps;

class EditLocationPanel extends React.PureComponent<EditLocationPanelProps, State> {
  constructor(props: EditLocationPanelProps) {
    super(props);
    this.state = {
      locationDetail: LocationDetailEditor.convertLocationToEditorState(props.location),
      isSaving: false,
    };
  }

  render() {
    return (
      <div className="edit-location-panel">
        <ConnectedLocationDetailEditor
          editorState={this.state.locationDetail}
          onStateUpdate={this.handleLocationStateUpdate}
        />
        <div className="edit-location-panel-edit-controls">
          <Button text="Cancel" onClick={this.props.onCancel} />
          <div className="right-group">
            {this.props.locationId && <Button text="Delete" intent={Intent.DANGER} onClick={this.props.onDelete} />}
            <Button text="Save" intent={Intent.SUCCESS} onClick={this.saveEdit} disabled={!this.canSaveLocation()} />
            {!this.props.locationId && (
              <Button
                text="Save and Add Review"
                intent={Intent.SUCCESS}
                onClick={this.saveEditAndAddReview}
                disabled={!this.canSaveLocation()}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  private handleLocationStateUpdate = (newState: LocationDetailEditorState) => {
    this.setState({ locationDetail: newState });
  }

  private canSaveLocation = () => {
    return LocationDetailEditor.isEditorStateComplete(this.state.locationDetail);
  }

  private saveEdit = async () => {
    const location = LocationDetailEditor.convertEditorStateToRequest(this.state.locationDetail);
    const savedLocation = await this.props.onSave(location);
    this.props.openDetailPanel(savedLocation.id);
  }

  private saveEditAndAddReview = async () => {
    const location = LocationDetailEditor.convertEditorStateToRequest(this.state.locationDetail);
    const savedLocation = await this.props.onSave(location);
    this.props.openEditReviewPanel(savedLocation.id);
  }
}

function mapStateToProps(state: RootState, ownProps: OwnProps): ConnectedProps {
  return {
    location: ownProps.locationId ? state.location.locations[ownProps.locationId] : undefined,
  };
}

const mapDispatchToProps = (dispatch: TypedDispatch, ownProps: OwnProps): DispatchProps => ({
  onCancel: () =>
    dispatch(ownProps.locationId
      ? ToggleDetailPanel.create({ locationId: ownProps.locationId })
      : ToggleEditPanel.create({})),

  onSave: (request: CreateLocationRequest) => {
    if (ownProps.locationId == null) {
      return dispatch(createLocation(request));
    } else {
      return dispatch(updateLocation(ownProps.locationId, request));
    }
  },

  onDelete: () => {
    if (ownProps.locationId) {
      dispatch(deleteLocation(ownProps.locationId)).then(() => dispatch(ClosePanel.create()));
    }
  },

  openDetailPanel: (locationId: string) => dispatch(ToggleDetailPanel.create({ locationId })),
  openEditReviewPanel: (locationId: string) => dispatch(OpenEditReviewPanel.create({ locationId })),
});

export const ConnectedEditLocationPanel: React.ComponentClass<OwnProps> =
  connect(mapStateToProps, mapDispatchToProps)(EditLocationPanel);

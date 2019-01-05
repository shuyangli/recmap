import { Button, Intent } from "@blueprintjs/core";
import * as firebase from "firebase";
import * as React from "react";
import { connect } from "react-redux";
import { Location, CreateLocationRequest } from "../../api/interfaces";
import { ClosePanel, ToggleDetailPanel, ToggleEditPanel } from "../../store/actionPanel/actions";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../store/locations/actions";
import { TypedDispatch } from "../../store/TypedDispatch";
import {
  LocationDetailEditorState,
  ConnectedLocationDetailEditor,
  LocationDetailEditor,
} from "../editors/LocationDetailEditor";
import { ReviewEditorState, ReviewEditor } from "../editors/ReviewEditor";

import "./EditLocationPanel.less";

interface OwnProps {
  location?: Location;
}

interface DispatchProps {
  onCancel: (locationId?: string) => void;
  onSave: (request: CreateLocationRequest, locationId?: string) => void;
  onDelete: (locationId: string) => void;
}

interface State {
  locationDetail: LocationDetailEditorState;
  review: ReviewEditorState;
  isSaving: boolean;
}

type EditLocationPanelProps = OwnProps & DispatchProps;

class EditLocationPanel extends React.PureComponent<EditLocationPanelProps, State> {
  constructor(props: EditLocationPanelProps) {
    super(props);
    const currentUserId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
    const userReview = (currentUserId && props.location) ? props.location.reviews[currentUserId] : null;

    this.state = {
      locationDetail: LocationDetailEditor.convertLocationToEditorState(props.location),
      review: ReviewEditor.convertReviewToEditorState(userReview),
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
        <ReviewEditor
          editorState={this.state.review}
          onStateUpdate={this.handleReviewStateUpdate}
        />

        <div className="edit-location-panel-edit-controls">
          <Button text="Cancel" onClick={this.cancelEdit} />
          <div className="right-group">
            {this.props.location && <Button text="Delete" intent={Intent.DANGER} onClick={this.deleteLocation} />}
            <Button text="Save" intent={Intent.SUCCESS} onClick={this.saveEdit} disabled={!this.canSaveLocation()} />
          </div>
        </div>
      </div>
    );
  }

  private handleLocationStateUpdate = (newState: LocationDetailEditorState) => {
    this.setState({ locationDetail: newState });
  }
  private handleReviewStateUpdate = (newState: ReviewEditorState) => {
    this.setState({ review: newState });
  }

  private canSaveLocation = () => {
    return LocationDetailEditor.isEditorStateComplete(this.state.locationDetail);
  }

  private cancelEdit = () => this.props.onCancel(this.props.location ? this.props.location.id : null);
  private saveEdit = () => {
    const location = LocationDetailEditor.convertEditorStateToRequest(this.state.locationDetail);
    if (ReviewEditor.isEditorStateComplete(this.state.review)) {
      const review = ReviewEditor.convertEditorStateToReview(this.state.review);
      location.review = review;
    }
    this.props.onSave(location, this.props.location ? this.props.location.id : null);
  }
  private deleteLocation = () => {
    if (this.props.location) {
      this.props.onDelete(this.props.location.id);
    }
  }
}

const mapDispatchToProps = (dispatch: TypedDispatch): DispatchProps => ({
  onCancel: (locationId?: string) =>
    dispatch(locationId
      ? ToggleDetailPanel.create({ locationId })
      : ToggleEditPanel.create({})),

  onSave: (request: CreateLocationRequest, locationId?: string) => {
    let promise: Promise<Location>;
    if (locationId == null) {
      promise = dispatch(createLocation(request));
    } else {
      promise = dispatch(updateLocation(locationId, request));
    }

    return promise.then((loc) => dispatch(ToggleDetailPanel.create({ locationId: loc.id })));
  },

  onDelete: (locationId: string) =>
    dispatch(deleteLocation(locationId))
    .then(() => dispatch(ClosePanel.create())),
});

export const ConnectedEditLocationPanel: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(EditLocationPanel);

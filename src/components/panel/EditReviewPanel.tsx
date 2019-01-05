import { Button, Intent } from "@blueprintjs/core";
import * as firebase from "firebase";
import * as React from "react";
import { connect } from "react-redux";
import { LocationReview } from "../../api/interfaces";
import { ToggleDetailPanel } from "../../store/actionPanel/actions";
import { TypedDispatch } from "../../store/TypedDispatch";
import { ReviewEditorState, ReviewEditor } from "../editors/ReviewEditor";

import "./EditReviewPanel.less";
import { RootState } from "../../store/RootState";
import { setReview } from "../../store/locations/actions";

interface OwnProps {
  locationId: string;
}

interface ConnectedProps {
  existingReview?: LocationReview;
}

interface DispatchProps {
  onCancel: () => void;
  onSave: (review: LocationReview) => void;
  onDelete: () => void;
}

interface State {
  review: ReviewEditorState;
  isSaving: boolean;
}

type EditReviewPanelProps = OwnProps & ConnectedProps & DispatchProps;

class EditReviewPanel extends React.PureComponent<EditReviewPanelProps, State> {
  constructor(props: EditReviewPanelProps) {
    super(props);
    this.state = {
      review: ReviewEditor.convertReviewToEditorState(props.existingReview),
      isSaving: false,
    };
  }

  render() {
    return (
      <div className="edit-review-panel">
        <ReviewEditor
          editorState={this.state.review}
          onStateUpdate={this.handleReviewStateUpdate}
        />
        <div className="edit-review-panel-edit-controls">
          <Button text="Cancel" onClick={this.props.onCancel} />
          <div className="right-group">
            {this.props.existingReview && <Button text="Delete" intent={Intent.DANGER} onClick={this.props.onDelete} />}
            <Button text="Save" intent={Intent.SUCCESS} disabled={!this.canSaveReview()} onClick={this.saveEdit} />
          </div>
        </div>
      </div>
    );
  }

  private handleReviewStateUpdate = (newState: ReviewEditorState) => {
    this.setState({ review: newState });
  }

  private saveEdit = () => {
    const review = ReviewEditor.convertEditorStateToReview(this.state.review);
    this.props.onSave(review);
  }

  private canSaveReview() {
    return ReviewEditor.isEditorStateComplete(this.state.review);
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const currentUserId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
  const location = state.location.locations[ownProps.locationId];
  const userReview = location && currentUserId ? location.reviews[currentUserId] : null;
  return {
    existingReview: userReview,
  };
};

const mapDispatchToProps = (dispatch: TypedDispatch, ownProps: OwnProps): DispatchProps => ({
  onCancel: () => dispatch(ToggleDetailPanel.create({ locationId: ownProps.locationId })),
  onSave: (review: LocationReview) => {
    dispatch(setReview(ownProps.locationId, review))
    .then(() => dispatch(ToggleDetailPanel.create({ locationId: ownProps.locationId })));
  },
  onDelete: () => dispatch(ToggleDetailPanel.create({ locationId: ownProps.locationId })),
});

export const ConnectedEditReviewPanel: React.ComponentClass<OwnProps> =
  connect(mapStateToProps, mapDispatchToProps)(EditReviewPanel);

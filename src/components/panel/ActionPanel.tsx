import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ClosePanel } from "../../store/actionPanel/actions";
import { ActionPanelType } from "../../store/actionPanel/types";
import { getCurrentLocationId } from "../../store/actionPanel/selectors";
import { RootState } from "../../store/RootState";
import { ConnectedEditLocationPanel } from "./EditLocationPanel";
import { ConnectedEditReviewPanel } from "./EditReviewPanel";
import { ConnectedLocationDetailsPanel } from "./LocationDetailsPanel";

import "./ActionPanel.less";

interface ConnectedProps {
  isVisible: boolean;
  type: ActionPanelType;
  locationId?: string;
}

interface DispatchProps {
  closePanel: () => void;
}

class ActionPanel extends React.PureComponent<ConnectedProps & DispatchProps, void> {
  render() {
    if (this.props.isVisible) {
      return (
        <div className="action-panel">
          {this.getActionPanel()}
        </div>
      );
    } else {
      return null;
    }
  }

  private getActionPanel() {
    switch (this.props.type) {
      case ActionPanelType.DETAIL:
        return <ConnectedLocationDetailsPanel locationId={this.props.locationId} />;
      case ActionPanelType.EDIT_LOCATION:
        return <ConnectedEditLocationPanel locationId={this.props.locationId} />;
      case ActionPanelType.EDIT_REVIEW:
        if (this.props.locationId == null) {
          throw new Error("Cannot edit review without specifying a location");
        }
        return <ConnectedEditReviewPanel locationId={this.props.locationId} />;
      default:
        throw new Error(`Invalid action panel type: ${this.props.type}`);
    }
  }
}

const mapStateToProps = (state: RootState): ConnectedProps => ({
  isVisible: state.actionPanel.isVisible,
  type: state.actionPanel.type,
  locationId: getCurrentLocationId(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  closePanel: () => dispatch(ClosePanel.create()),
});

export const ConnectedActionPanel: React.ComponentClass<{}>
  = connect(mapStateToProps, mapDispatchToProps)(ActionPanel as any);

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Location } from "../../api/interfaces";
import { ClosePanel } from "../../store/actionPanel/actions";
import { ActionPanelType } from "../../store/actionPanel/types";
import { getCurrentLocationId } from "../../store/actionPanel/selectors";
import { RootState } from "../../store/RootState";
import { ConnectedEditLocationPanel } from "./EditLocationPanel";
import { ConnectedLocationDetailsPanel } from "./LocationDetailsPanel";

import "./ActionPanel.less";

interface ConnectedProps {
  isVisible: boolean;
  type: ActionPanelType;
  locationId?: string;
  locations: { [id: string]: Location };
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
        return (
          <ConnectedLocationDetailsPanel
            location={this.props.locations[this.props.locationId]}
          />
        );
      case ActionPanelType.EDIT:
        return (
          <ConnectedEditLocationPanel
            initialLocation={this.props.locationId
            ? this.props.locations[this.props.locationId]
            : undefined}
          />
        );
      default:
        throw new Error(`Invalid action panel type: ${this.props.type}`);
    }
  }
}

const mapStateToProps = (state: RootState): ConnectedProps => ({
  isVisible: state.actionPanel.isVisible,
  type: state.actionPanel.type,
  locationId: getCurrentLocationId(state),
  locations: state.location.locations,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  closePanel: () => dispatch(ClosePanel.create()),
});

export const ConnectedActionPanel: React.ComponentClass<{}>
  = connect(mapStateToProps, mapDispatchToProps)(ActionPanel as any);

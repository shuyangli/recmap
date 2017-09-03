import { Button, Classes, IconClasses } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Location } from "@src/api/interfaces";
import { ClosePanel } from "@src/store/actionPanel/actions";
import { ActionPanelType } from "@src/store/actionPanel/types";
import { RootState } from "@src/store/store";
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
          <div className="action-panel-header">
            <Button
              className={classNames(Classes.MINIMAL, Classes.SMALL)}
              iconName={IconClasses.CROSS}
              onClick={this.props.closePanel}
            />
          </div>
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
  locationId: state.actionPanel.locationId,
  locations: state.location.locations,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => ({
  closePanel: () => dispatch(ClosePanel.create()),
});

export const ConnectedActionPanel: React.ComponentClass<{}>
  = connect(mapStateToProps, mapDispatchToProps)(ActionPanel as any);

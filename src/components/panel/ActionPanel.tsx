import * as React from "react";
import { connect } from "react-redux";

import { Location } from "@src/api/interfaces";
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

class ActionPanel extends React.PureComponent<ConnectedProps, void> {
  render() {
    if (this.props.isVisible) {
      return (
        <div className="action-panel">
          {
            this.props.type === ActionPanelType.DETAIL
            ? (
              <ConnectedLocationDetailsPanel
                location={this.props.locations[this.props.locationId]}
              />
            ) : (
              <ConnectedEditLocationPanel
                initialLocation={this.props.locationId
                ? this.props.locations[this.props.locationId]
                : undefined}
              />
            )
          }
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    isVisible: state.actionPanel.isVisible,
    type: state.actionPanel.type,
    locationId: state.actionPanel.locationId,
    locations: state.location.locations,
  };
}

export const ConnectedActionPanel: React.ComponentClass<{}>
  = connect(mapStateToProps)(ActionPanel as any);

import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { EditLocationPanel } from './EditLocationPanel';

import './ActionPanel.less'

interface ConnectedProps {
  isVisible: boolean;
  locationId?: string;
}

function mapStateToProps(state: any): ConnectedProps {
  return {
    isVisible: state.actionPanel.isVisible,
    locationId: state.actionPanel.locationId
  };
}

class ActionPanel extends React.PureComponent<ConnectedProps, void> {
  render() {
    if (this.props.isVisible) {
      return (
        <div className='action-panel pt-elevation-0'>
          <EditLocationPanel />
        </div>
      );
    } else {
      return null;
    }
  }
}

export const ConnectedActionPanel = connect(mapStateToProps)(ActionPanel);

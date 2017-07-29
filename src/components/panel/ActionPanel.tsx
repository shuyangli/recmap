import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Location } from '../../api/interfaces';
import { RootState } from '../../store/store';
import { ActionPanelType } from '../../store/reducers/actionPanelReducer';

import { ConnectedLocationDetailsPanel } from './LocationDetailsPanel';
import { ConnectedEditLocationPanel } from './EditLocationPanel';

import './ActionPanel.less'

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
        <div className='action-panel pt-elevation-0'>
          {
            this.props.type === ActionPanelType.DETAIL
            ? <ConnectedLocationDetailsPanel
                location={this.props.locations[this.props.locationId]}
              />
            : <ConnectedEditLocationPanel
                initialLocation={this.props.locationId
                ? this.props.locations[this.props.locationId]
                : undefined}
              />
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
    locations: state.location.locations
  };
}

export const ConnectedActionPanel = connect(mapStateToProps)(ActionPanel);

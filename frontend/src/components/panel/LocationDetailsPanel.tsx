import * as React from 'react';
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { RootState } from '../../store/store';
import { toggleEditPanel } from '../../store/actions';

interface OwnProps {
  location: Location;
}

interface DispatchProps {
  onEdit: (locationId: string) => void;
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onEdit: (locationId: string) => dispatch(toggleEditPanel(locationId))
  };
}

class LocationDetailsPanel extends React.PureComponent<OwnProps & DispatchProps, void> {

  private onEdit = () => this.props.onEdit(this.props.location.id);

  render() {
    return (
      <div className='location-panel'>
        <div className='location-content-wrapper'>
          <h1>{this.props.location.name}</h1>
          <p>{this.props.location.address}</p>
          <p>{this.props.location.notes}</p>
          <p>{this.props.location.latitude}, {this.props.location.longitude}</p>
        </div>

        <div className='panel-edit-controls pt-elevation-1'>
          <Button text='Edit' onClick={this.onEdit} />
        </div>
      </div>
    );
  }
}

export const ConnectedLocationDetailsPanel: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(LocationDetailsPanel) as any;

import * as React from 'react';
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Button, Tag } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { RootState } from '../../store/store';
import { toggleEditPanel } from '../../store/actionPanel/actions';

interface OwnProps {
  location: Location;
}

interface DispatchProps {
  onEdit: (locationId: string) => void;
}

class LocationDetailsPanel extends React.PureComponent<OwnProps & DispatchProps, void> {

  private onEdit = () => this.props.onEdit(this.props.location.id);

  render() {
    return (
      <div className='location-panel'>
        <div className='location-content-wrapper'>
          <h1 className='location-name'>{this.props.location.name}</h1>
          <div className='location-tag-area'>
            {this.props.location.tags.map((tag: string) =>
              <Tag key={tag}>{tag}</Tag>
            )}
          </div>
          <p className='location-address'>{this.props.location.address}</p>
          <p className='location-notes'>{this.props.location.notes}</p>
        </div>

        <div className='panel-edit-controls pt-elevation-1'>
          <Button text='Edit' onClick={this.onEdit} />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onEdit: (locationId: string) => dispatch(toggleEditPanel(locationId))
  };
}

export const ConnectedLocationDetailsPanel: React.ComponentClass<OwnProps> =
  connect<void, DispatchProps, OwnProps>(null, mapDispatchToProps)(LocationDetailsPanel as any);

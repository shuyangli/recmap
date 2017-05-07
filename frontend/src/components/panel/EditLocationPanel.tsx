import * as React from 'react';
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { RootState } from '../../store/store';
import { toggleEditPanel, toggleDetailsPanel, createOrUpdateLocation } from '../../store/actions';

interface OwnProps {
  initialLocation: Location;
}

interface DispatchProps {
  onCancel: (locationId?: string) => void;
  onSave: (location: Location) => void;
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onCancel: (locationId?: string) => {
      if (locationId !== undefined) {
        dispatch(toggleDetailsPanel(locationId))
      } else {
        dispatch(toggleEditPanel())
      }
    },
    onSave: (location: Location) => {
      dispatch(createOrUpdateLocation(location))
      .then((action) => dispatch(toggleDetailsPanel(action.payload.location.id)))
    }
  }
}

interface State {
  dirtyLocation: Location;
  isSaving: boolean;
}

const EMPTY_STATE: State = {
  dirtyLocation: {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    notes: ''
  },
  isSaving: false
};

class EditLocationPanel extends React.PureComponent<OwnProps & DispatchProps, State> {

  state: State = EMPTY_STATE;

  componentWillMount() {
    if (this.props.initialLocation) {
      this.setState({ dirtyLocation: _.assign({}, this.props.initialLocation) });
    }
  }

  private onCancel = () => this.props.onCancel(this.state.dirtyLocation.id);

  private onSave = () => {
    this.props.onSave(this.state.dirtyLocation);
  }

  render() {
    return (
      <div className='location-panel'>

        <div className='location-content-wrapper'>
          <h1>{this.state.dirtyLocation.name}</h1>
          <p>{this.state.dirtyLocation.address}</p>
          <p>{this.state.dirtyLocation.notes}</p>
          <p>{this.state.dirtyLocation.latitude}, {this.state.dirtyLocation.longitude}</p>
        </div>

        <div className='panel-edit-controls pt-elevation-1'>
          <Button text='Cancel' onClick={this.onCancel} />
          <Button text='Save' intent={Intent.SUCCESS} onClick={this.onSave} />
        </div>
      </div>
    );
  }
}

export const ConnectedEditLocationPanel: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(EditLocationPanel) as any;

import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleDetailsPanel } from '../../store/actions';
import { Location } from '../../api/interfaces';

interface OwnProps {
  location: Location;
}

interface ConnectedProps {
  getOpenDetailsPanel: (locationId: string) => () => void;
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): ConnectedProps {
  return {
    getOpenDetailsPanel: (locationId: string) => () => dispatch(toggleDetailsPanel(locationId))
  }
}

class LocationItem extends React.PureComponent<OwnProps & ConnectedProps, void> {
  render() {
    return (
      <div className='location-item' onClick={this.props.getOpenDetailsPanel(this.props.location.id)}>
        <h5 className='name'>{this.props.location.name}</h5>
        <p className='address'>{this.props.location.address}</p>
        <span>{this.props.location.notes}</span>
      </div>
    );
  }
}

export const ConnectedLocationItem: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(LocationItem) as any;

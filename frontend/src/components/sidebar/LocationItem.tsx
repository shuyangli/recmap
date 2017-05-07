import * as React from 'react';
import { Location } from '../../api/interfaces';

interface Props {
  location: Location;
}

export class LocationItem extends React.PureComponent<Props, void> {
  render() {
    return (
      <div
        className='location-item'
        key={this.props.location.id}
      >
        <h5 className='name'>{this.props.location.name}</h5>
        <p className='address'>{this.props.location.address}</p>
        <span>{this.props.location.notes}</span>
      </div>
    );
  }
}
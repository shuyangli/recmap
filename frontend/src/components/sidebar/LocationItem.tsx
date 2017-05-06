import * as React from 'react';
import { Location } from '../../api/interfaces';

interface Props {
  location: Location;
}

export class LocationItem extends React.PureComponent<Props, void> {
  render() {
    return (
      <div
        className="location-item"
        key={this.props.location.id}
      >
        <span>{this.props.location.name}</span>
        <span>{this.props.location.address}</span>
        <span>{this.props.location.notes}</span>
      </div>
    );
  }
}
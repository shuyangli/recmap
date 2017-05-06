import * as React from 'react';
import { connect } from 'react-redux';
import { Location } from '../../api/interfaces';
import { LocationItem } from './LocationItem';

interface ConnectedProps {
  locations: Location[];
}

function mapStateToProps(state: any): ConnectedProps {
  return {
    locations: state.location.locations
  };
}

class LocationsSidebar extends React.PureComponent<ConnectedProps, void> {
  render() {
    return (
      <div className="location-sidebar">
        {this.props.locations.map((location) => <LocationItem location={location} />)}
      </div>
    );
  }
}

export const ConnectedLocationsSidebar = connect(mapStateToProps)(LocationsSidebar);

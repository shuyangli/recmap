import * as React from 'react';
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Classes, Tag } from "@blueprintjs/core";
import { RootState } from '@src/store/store';
import { toggleDetailsPanel } from '@src/store/actionPanel/actions';
import { Location } from '@src/api/interfaces';

interface OwnProps {
  location: Location;
}

interface ConnectedProps {
  getOpenDetailsPanel: (locationId: string) => () => void;
}

class LocationItem extends React.PureComponent<OwnProps & ConnectedProps, void> {
  render() {
    return (
      <div className="location-item" onClick={this.props.getOpenDetailsPanel(this.props.location.id)}>
        <div className="location-item-left">
          <h5 className="name">{this.props.location.name}</h5>
          {!_.isEmpty(this.props.location.tags) &&
            <Tag className={Classes.MINIMAL}>{this.props.location.tags[0]}</Tag>
          }
        </div>

        {this.props.location.rating && <span className="rating">{this.props.location.rating}</span>}
        <p className="address">{this.props.location.address}</p>
        <span>{this.props.location.notes}</span>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): ConnectedProps {
  return {
    getOpenDetailsPanel: (locationId: string) => () => dispatch(toggleDetailsPanel(locationId))
  }
}

export const ConnectedLocationItem: React.ComponentClass<OwnProps> =
  connect<ConnectedProps, void, OwnProps>(null, mapDispatchToProps)(LocationItem as any);

import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Location } from '../../api/interfaces';
import { initializeMapElement, getCurrentLocation, mapsDefaults } from '../../api/MapsApi';

import './Map.less'

export class Map extends React.PureComponent<{}, void> {

  private mapRef: HTMLDivElement;
  private map: any;

  componentDidMount = () => {
    this.map = initializeMapElement(this.mapRef);
  }

  render() {
    return (
      <div id='map' ref={(element) => this.mapRef = element} />
    );
  }
}

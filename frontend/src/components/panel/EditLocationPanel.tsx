import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Button, NonIdealState, Spinner } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';

export class EditLocationPanel extends React.PureComponent<{}, void> {
  render() {
    return (
      <div className='location-panel edit-location-panel'>
      </div>
    );
  }
}

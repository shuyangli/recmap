import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';

import { FilterState } from './types';
import { Location } from '../../api/interfaces';

interface Props {
  filters: FilterState;
  onFilterChange: (newState: FilterState) => void;
}

export class FilterControls extends React.PureComponent<Props, void> {
  render() {
    return (
      <div className='sidebar-filter-controls'>
        <input
          className='pt-input pt-large'
          type='search'
          placeholder='Search'
          value={this.props.filters.searchTerm}
          onChange={(event) => this.props.onFilterChange(_.assign({}, this.props.filters,
            { searchTerm: event.target.value }
          ))}
        />
      </div>
    );
  }
}

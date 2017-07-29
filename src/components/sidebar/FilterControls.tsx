import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Checkbox } from '@blueprintjs/core';

import { FilterState } from './types';
import { Location } from '../../api/interfaces';

interface Props {
  filters: FilterState;
  onFilterChange: (newState: FilterState) => void;
}

export class FilterControls extends React.PureComponent<Props, void> {
  render() {
    return (
      <div className='sidebar-filter-controls pt-elevation-1'>
        <div className='search-group pt-input-group pt-large'>
          <span className='pt-icon pt-icon-search' />
          <input
            className='search-term-input pt-input'
            type='search'
            placeholder='Search'
            value={this.props.filters.searchTerm}
            onChange={(event) => this.props.onFilterChange(_.assign({}, this.props.filters,
              { searchTerm: event.target.value }
            ))}
          />
        </div>

        <div className='tag-group pt-control-group'>
          <Checkbox label='Cuisine 1' />
          <Checkbox label='Cuisine 2' />
          <Checkbox label='Cuisine 3' />
        </div>

      </div>
    );
  }
}

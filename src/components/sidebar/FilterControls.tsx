import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { Checkbox } from '@blueprintjs/core';

import { FilterState } from '../../store/locations/types';
import { updateFilter } from '../../store/locations/actions';
import { Location } from '../../api/interfaces';

interface ConnectedProps {
  filter: FilterState;
}

interface DispatchProps {
  onFilterChange: (newFilter: FilterState) => void;
}

class FilterControls extends React.PureComponent<ConnectedProps & DispatchProps, {}> {
  render() {
    return (
      <div className='sidebar-filter-controls pt-elevation-1'>
        <div className='search-group pt-input-group pt-large'>
          <span className='pt-icon pt-icon-search' />
          <input
            className='search-term-input pt-input'
            type='search'
            placeholder='Search'
            value={this.props.filter.searchTerm}
            onChange={(event) => this.props.onFilterChange(Object.assign({}, this.props.filter,
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

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    filter: state.location.filter
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onFilterChange: (newFilter: FilterState) => dispatch(updateFilter(newFilter))
  };
}

export const ConnectedFilterControls: React.ComponentClass<{}>
  = connect(mapStateToProps, mapDispatchToProps)(FilterControls as any);

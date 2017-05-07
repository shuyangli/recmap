import * as React from 'react';
import * as _ from 'lodash';
import * as fuzzy from 'fuzzy';
import { connect } from 'react-redux';
import { NonIdealState, Spinner } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { LocationItem } from './LocationItem';
import { FilterControls } from './FilterControls';
import { FilterState } from './types';

import './LocationSidebar.less'

interface ConnectedProps {
  locations: {[id: string]: Location};
  isLoading: boolean;
}

interface State {
  filters: FilterState;
}

const EMPTY_STATE: State = {
  filters: {
    searchTerm: ''
  }
};

function mapStateToProps(state: any): ConnectedProps {
  return {
    locations: state.location.locations,
    isLoading: state.location.isLoading
  };
}

class LocationSidebar extends React.PureComponent<ConnectedProps, State> {

  state: State = EMPTY_STATE;

  render() {
    const filteredLocations = this.getFilteredLocations();

    return (
      <div className='location-sidebar pt-elevation-1'>
        <FilterControls
          filters={this.state.filters}
          onFilterChange={(newFilters: FilterState) => this.setState({ filters: newFilters })}
        />
        {
          this.props.isLoading
          ? <NonIdealState visual={<Spinner />} />
          : <div className='location-items-wrapper'>
              {_.map(filteredLocations, (location) =>
                <LocationItem location={location} />
              )}
            </div>
        }
      </div>
    );
  }

  private getFilteredLocations = () => {
    if (this.state.filters.searchTerm) {
      const filtered = fuzzy.filter(
        this.state.filters.searchTerm,
        _.toArray(this.props.locations),
        { extract: (location) => location.name }
      );
      // When a search term is present, the results are sorted by relevance,
      // and fuzzy already sorts them for us.
      return filtered.map(result => result.original);
    } else {
      return this.props.locations;
    }
  }
}

export const ConnectedLocationSidebar = connect(mapStateToProps)(LocationSidebar);

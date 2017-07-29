import * as React from 'react';
import * as _ from 'lodash';
import * as fuzzy from 'fuzzy';
import { connect, Dispatch } from 'react-redux';
import { Button, NonIdealState, Spinner } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { ConnectedLocationItem } from './LocationItem';
import { FilterControls } from './FilterControls';
import { FilterState } from './types';
import { RootState } from '../../store/store';
import { loadLocations, toggleEditPanel } from '../../store/actions';

import './LocationSidebar.less'

interface ConnectedProps {
  locations: {[id: string]: Location};
}

interface DispatchProps {
  openEditPanel: () => void;
  loadLocations: () => Promise<any>;
}

interface State {
  filters: FilterState;
  isLoadingLocations: boolean;
}

class LocationSidebar extends React.PureComponent<ConnectedProps & DispatchProps, State> {
  state: State = {
    filters: {
      searchTerm: ''
    },
    isLoadingLocations: false
  };

  componentWillMount() {
    this.setState({ isLoadingLocations: true });
    this.props.loadLocations()
    .then(() => this.setState({ isLoadingLocations: false }));
  }

  render() {
    const filteredLocations = this.getFilteredLocations();

    return (
      <div className='location-sidebar pt-elevation-1'>
        <FilterControls
          filters={this.state.filters}
          onFilterChange={(newFilters: FilterState) => this.setState({ filters: newFilters })}
        />
        {
          this.state.isLoadingLocations
          ? <NonIdealState visual={<Spinner />} />
          : <div className='location-items-wrapper'>
              {_.map(filteredLocations, (location) =>
                <ConnectedLocationItem key={location.id} location={location} />
              )}
            </div>
        }
        <div className='sidebar-edit-controls'>
          <Button iconName='add' onClick={this.props.openEditPanel} />
        </div>
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

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    locations: state.location.locations
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    openEditPanel: () => dispatch(toggleEditPanel()),
    loadLocations: () => dispatch(loadLocations())
  };
}

export const ConnectedLocationSidebar = connect(mapStateToProps, mapDispatchToProps)(LocationSidebar);

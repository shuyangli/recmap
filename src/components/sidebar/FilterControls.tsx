import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import * as Select from 'react-select';
import { Checkbox } from '@blueprintjs/core';

import { RootState } from '@src/store/store';
import { FilterState } from '@src/store/locations/types';
import { updateFilter } from '@src/store/locations/actions';
import { backendApi } from '@src/api/BackendApi';
import { Location } from '@src/api/interfaces';

interface ConnectedProps {
  filter: FilterState;
}

interface DispatchProps {
  onFilterChange: (newFilter: FilterState) => void;
}

interface IState {
  allTags: string[];
}

class FilterControls extends React.PureComponent<ConnectedProps & DispatchProps, IState> {
  state: IState = {
    allTags: []
  }

  private getSelectOptions = (rawStrings: string[]): Select.Option<string>[] => {
    return rawStrings.map(tag => ({
      label: tag,
      value: tag
    }));
  }

  private onTagsChanged = (newTags: string[]) => {
    this.props.onFilterChange({ ...this.props.filter, tags: newTags });
  }

  componentWillMount() {
    backendApi.getAllTags().then(allTags => this.setState({ allTags }));
  }

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
            onChange={(event) => this.props.onFilterChange({
              ...this.props.filter,
              searchTerm: event.target.value
            })}
          />
        </div>

        <Select
          className="tag-select"
          backspaceToRemoveMessage=""
          multi={true}
          options={this.getSelectOptions(this.state.allTags)}
          value={this.getSelectOptions(this.props.filter.tags)}
          placeholder='Add tags'
          onChange={(values: Select.Option<string>[]) => this.onTagsChanged(values.map(value => value.value))}
        />
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

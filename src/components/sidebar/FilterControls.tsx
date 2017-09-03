import { Classes, Icon, IconClasses } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import * as Select from "react-select";

import { backendApi } from "@src/api/BackendApi";
import { UpdateFilter } from "@src/store/locations/actions";
import { FilterState } from "@src/store/locations/types";
import { RootState } from "@src/store/store";

import "./FilterControls.less";

interface ConnectedProps {
  filter: FilterState;
}

interface DispatchProps {
  onFilterChange: (newFilter: FilterState) => void;
}

interface State {
  allTags: string[];
}

class FilterControls extends React.PureComponent<ConnectedProps & DispatchProps, State> {
  state: State = {
    allTags: [],
  };

  componentWillMount() {
    backendApi.getAllTags().then((allTags) => this.setState({ allTags }));
  }

  render() {
    return (
      <div className="sidebar-filter-controls">
        <div className="filter-control-group">
          <Icon iconName={IconClasses.SEARCH} />
          <input
            className={classNames("search-term-input", Classes.INPUT)}
            type="search"
            placeholder="Search..."
            value={this.props.filter.searchTerm}
            onChange={this.onSearchTermChange}
          />
        </div>

        <div className="filter-control-group">
          <Icon iconName={IconClasses.FILTER} />
          <Select
            className="tag-select"
            backspaceToRemoveMessage=""
            multi={true}
            options={this.getSelectOptions(this.state.allTags)}
            value={this.getSelectOptions(this.props.filter.tags)}
            placeholder="Filter by tags"
            onChange={this.onTagsChange}
          />
        </div>
      </div>
    );
  }

  private onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onFilterChange({ ...this.props.filter, searchTerm: event.target.value });
  }

  private getSelectOptions(rawStrings: string[]): Array<Select.Option<string>> {
    return rawStrings.map((tag) => ({
      label: tag,
      value: tag,
    }));
  }

  private onTagsChange = (values: Array<Select.Option<string>>) => {
    const tags = values.map((value) => value.value);
    this.props.onFilterChange({ ...this.props.filter, tags });
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    filter: state.location.filter,
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onFilterChange: (newFilter: FilterState) => dispatch(UpdateFilter.create({ filter: newFilter })),
  };
}

export const ConnectedFilterControls: React.ComponentClass<{}>
  = connect(mapStateToProps, mapDispatchToProps)(FilterControls as any);

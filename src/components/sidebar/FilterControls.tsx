import { Classes, Icon } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { backendApi } from "../../api/BackendApi";
import { UpdateFilter } from "../../store/locations/actions";
import { FilterState } from "../../store/locations/types";
import { RootState } from "../../store/RootState";

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
          <Icon icon="search" />
          <input
            className={classNames("search-term-input", Classes.INPUT, Classes.FILL)}
            type="search"
            placeholder="Search..."
            value={this.props.filter.searchTerm}
            onChange={this.onSearchTermChange}
          />
        </div>

        <div className="filter-control-group">
          <Icon icon="filter" />
          {/* <Select
            className="tag-select"
            backspaceToRemoveMessage=""
            multi={true}
            options={this.getSelectOptions(this.state.allTags)}
            value={this.getSelectOptions(this.props.filter.tags)}
            placeholder="Filter by tags"
            onChange={this.onTagsChange}
          /> */}
        </div>
      </div>
    );
  }

  private onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onFilterChange({ ...this.props.filter, searchTerm: event.target.value });
  }

  // private getSelectOptions(rawStrings: string[]): Array<Select.Option<string>> {
  //   return rawStrings.map((tag) => ({
  //     label: tag,
  //     value: tag,
  //   }));
  // }

  // private onTagsChange = (values: Array<Select.Option<string>>) => {
  //   const tags = values.map((value) => value.value);
  //   this.props.onFilterChange({ ...this.props.filter, tags });
  // }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    filter: state.location.filter,
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    onFilterChange: (newFilter: FilterState) => dispatch(UpdateFilter.create({ filter: newFilter })),
  };
}

export const ConnectedFilterControls: React.ComponentClass<{}>
  = connect(mapStateToProps, mapDispatchToProps)(FilterControls as any);

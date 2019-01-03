import { Classes, Icon, Checkbox } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { UpdateFilter } from "../../store/locations/actions";
import { FilterState } from "../../store/locations/types";
import { RootState } from "../../store/RootState";
import { PriceRangeSelect } from "../shared/PriceRangeSelect";
import { PriceRange, Rating } from "../../api/interfaces";
import { RatingSelect } from "../shared/RatingSelect";

import "./FilterControls.less";

interface ConnectedProps {
  filter: FilterState;
}

interface DispatchProps {
  onFilterChange: (newFilter: FilterState) => void;
}

class FilterControls extends React.PureComponent<ConnectedProps & DispatchProps, never> {
  render() {
    return (
      <div className="sidebar-filter-controls">
        <div className="filter-control-group">
          <Icon className="filter-control-icon" icon="search" />
          <input
            className={classNames("search-term-input", Classes.INPUT, Classes.FILL)}
            placeholder="Search..."
            value={this.props.filter.searchTerm}
            onChange={this.handleSearchTermChange}
          />
        </div>
        <div className="filter-control-group">
          <Icon className="filter-control-icon" icon="filter" />
          <div>
            <div className="filter-control-sub-group">
              <PriceRangeSelect
                priceRange={this.props.filter.priceRange.range}
                onSelect={this.handlePriceRangeChange}
                clearable={true}
              />
              {this.maybeRenderPriceRangeCheckbox()}
            </div>

            <div className="filter-control-sub-group">
              <RatingSelect
                rating={this.props.filter.rating.rating}
                onSelect={this.handleRatingChange}
                clearable={true}
              />
              {this.maybeRenderRatingCheckbox()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onFilterChange({ ...this.props.filter, searchTerm: event.target.value });
  }

  private handlePriceRangeChange = (range: PriceRange | undefined) => {
    this.props.onFilterChange({ ...this.props.filter, priceRange: {
      ...this.props.filter.priceRange,
      range,
    }});
  }

  private handleRatingChange = (rating: Rating | undefined) => {
    this.props.onFilterChange({ ...this.props.filter, rating: {
      ...this.props.filter.rating,
      rating,
    }});
  }

  private handlePriceRangeOrLowerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onFilterChange({ ...this.props.filter, priceRange: {
      ...this.props.filter.priceRange,
      includeLower: event.currentTarget.checked,
    }});
  }

  private handleRatingOrHigherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onFilterChange({ ...this.props.filter, rating: {
      ...this.props.filter.rating,
      includeHigher: event.currentTarget.checked,
    }});
  }

  private maybeRenderPriceRangeCheckbox() {
    if (this.props.filter.priceRange.range != null) {
      return (
        <Checkbox
          className="filter-control-bounds-checkbox"
          checked={this.props.filter.priceRange.includeLower}
          label="or lower"
          onChange={this.handlePriceRangeOrLowerChange}
        />
      );
    }
  }

  private maybeRenderRatingCheckbox() {
    if (this.props.filter.rating.rating != null) {
      return (
        <Checkbox
          className="filter-control-bounds-checkbox"
          checked={this.props.filter.rating.includeHigher}
          label="or higher"
          onChange={this.handleRatingOrHigherChange}
        />
      );
    }
  }
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

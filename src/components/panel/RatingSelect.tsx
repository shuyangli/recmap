import { Classes, MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";
import { LocationRating } from "../location";

const RawRatingSelect = Select.ofType<number>();

const allowedRatings = [2, 1, 0, -1];

export interface RatingSelectProps {
  rating?: number;
  onSelect: (rating: number) => void;
}

export class RatingSelect extends React.PureComponent<RatingSelectProps, never> {
  render() {
    return (
      <RawRatingSelect
        className={classNames("rating-select", Classes.FILL)}
        items={allowedRatings}
        filterable={false}
        itemRenderer={this.renderItem}
        noResults={"No results"}
        onItemSelect={this.props.onSelect}
      >
        <Button text={this.props.rating == null ? "Select rating" : <LocationRating rating={this.props.rating} />} />
      </RawRatingSelect>
    );
  }

  private renderItem: ItemRenderer<number> = (rating, { modifiers, handleClick }) => {
    return (
        <MenuItem
            active={modifiers.active}
            onClick={handleClick}
            text={<LocationRating rating={rating} />}
            shouldDismissPopover={false}
        />
    );
  }
}

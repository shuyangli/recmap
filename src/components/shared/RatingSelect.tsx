import { Classes, MenuItem, Button, AnchorButton } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";
import { LocationRating } from "./";
import { Rating } from "../../api/interfaces";

import "./RatingSelect.less";

const RawRatingSelect = Select.ofType<Rating>();

const allowedRatings = [Rating.GREAT, Rating.GOOD, Rating.NEUTRAL, Rating.BAD];

export interface RatingSelectProps {
  rating?: Rating;
  clearable?: boolean;
  onSelect: (rating: Rating | undefined) => void;
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
        <AnchorButton className="rating-select-outer-button">
          {this.props.rating == null ? "Select rating" : <LocationRating rating={this.props.rating} />}
          {this.maybeRenderClearButton()}
        </AnchorButton>
      </RawRatingSelect>
    );
  }

  private renderItem: ItemRenderer<Rating> = (rating, { modifiers, handleClick }) => {
    return (
        <MenuItem
            key={`${rating}`}
            onClick={handleClick}
            text={<LocationRating rating={rating} />}
            shouldDismissPopover={false}
        />
    );
  }

  private clearSelect = () => this.props.onSelect(undefined);

  private maybeRenderClearButton() {
    if (this.props.clearable && this.props.rating != null) {
      return <Button minimal={true} icon="cross" onClick={this.clearSelect} />;
    }
  }
}

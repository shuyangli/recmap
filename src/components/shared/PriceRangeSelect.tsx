import { Classes, MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";
import { PriceRange } from "../../api/interfaces";

const RawPriceRangeSelect = Select.ofType<PriceRange>();

const allowedPriceRanges = [
  PriceRange.ZERO_TO_TEN,
  PriceRange.TEN_TO_TWENTY_FIVE,
  PriceRange.TWENTY_FIVE_TO_FIFTY,
  PriceRange.OVER_FIFTY,
];

const priceRangeToText = {
  [PriceRange.ZERO_TO_TEN]: "Less than $10",
  [PriceRange.TEN_TO_TWENTY_FIVE]: "$10 - $25",
  [PriceRange.TWENTY_FIVE_TO_FIFTY]: "$25 - $50",
  [PriceRange.OVER_FIFTY]: "Over $50",
};

export interface PriceRangeSelectProps {
  priceRange?: PriceRange;
  onSelect: (priceRange: PriceRange) => void;
}

export class PriceRangeSelect extends React.PureComponent<PriceRangeSelectProps, never> {
  render() {
    return (
      <RawPriceRangeSelect
        className={classNames("price-range-select", Classes.FILL)}
        items={allowedPriceRanges}
        filterable={false}
        itemRenderer={this.renderItem}
        noResults={"No results"}
        onItemSelect={this.props.onSelect}
      >
        <Button text={this.props.priceRange == null ? "Select price range" : priceRangeToText[this.props.priceRange]} />
      </RawPriceRangeSelect>
    );
  }

  private renderItem: ItemRenderer<PriceRange> = (priceRange, { modifiers, handleClick }) => {
    return (
        <MenuItem
            key={`${priceRange}`}
            active={modifiers.active}
            onClick={handleClick}
            text={priceRangeToText[priceRange]}
            shouldDismissPopover={false}
        />
    );
  }
}

import { Classes, MenuItem, Button } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";
import { PriceRange } from "../../api/interfaces";
import { getPriceRangeText } from "./getPriceRangeText";

const RawPriceRangeSelect = Select.ofType<PriceRange>();

const allowedPriceRanges = [
  PriceRange.ZERO_TO_TEN,
  PriceRange.TEN_TO_TWENTY_FIVE,
  PriceRange.TWENTY_FIVE_TO_FIFTY,
  PriceRange.OVER_FIFTY,
];

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
        <Button text={getPriceRangeText(this.props.priceRange) || "Select price range"} />
      </RawPriceRangeSelect>
    );
  }

  private renderItem: ItemRenderer<PriceRange> = (priceRange, { modifiers, handleClick }) => {
    return (
        <MenuItem
            key={`${priceRange}`}
            active={modifiers.active}
            onClick={handleClick}
            text={getPriceRangeText(priceRange)}
            shouldDismissPopover={false}
        />
    );
  }
}

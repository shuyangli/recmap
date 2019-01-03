import { Classes, MenuItem, Button, AnchorButton } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";
import { PriceRange } from "../../api/interfaces";
import { getPriceRangeText } from "./getPriceRangeText";

import "./PriceRangeSelect.less";

const RawPriceRangeSelect = Select.ofType<PriceRange>();

const allowedPriceRanges = [
  PriceRange.ZERO_TO_TEN,
  PriceRange.TEN_TO_TWENTY_FIVE,
  PriceRange.TWENTY_FIVE_TO_FIFTY,
  PriceRange.OVER_FIFTY,
];

export interface PriceRangeSelectProps {
  priceRange?: PriceRange;
  clearable?: boolean;
  onSelect: (priceRange: PriceRange | undefined) => void;
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
        <AnchorButton className="price-range-select-outer-button">
          {getPriceRangeText(this.props.priceRange) || "Select price range"}
          {this.maybeRenderClearButton()}
        </AnchorButton>
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

  private clearSelect = () => this.props.onSelect(undefined);

  private maybeRenderClearButton() {
    if (this.props.clearable && this.props.priceRange != null) {
      return <Button small={true} minimal={true} icon="cross" onClick={this.clearSelect} />;
    }
  }
}

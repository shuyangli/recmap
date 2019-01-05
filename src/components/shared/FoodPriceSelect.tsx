import { Classes, MenuItem, Button, AnchorButton } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";
import { FoodPrice } from "../../api/interfaces";
import { getFoodPriceText } from "./getFoodPriceText";

import "./FoodPriceSelect.less";

const RawFoodPriceSelect = Select.ofType<FoodPrice>();

const allowedFoodPrices = [
  FoodPrice.ZERO_TO_FIFTEEN,
  FoodPrice.FIFTEEN_TO_THIRTY,
  FoodPrice.THIRTY_TO_SIXTY,
  FoodPrice.OVER_SIXTY,
];

export interface FoodPriceSelectProps {
  priceRange?: FoodPrice;
  clearable?: boolean;
  onSelect: (priceRange: FoodPrice | undefined) => void;
}

export class FoodPriceSelect extends React.PureComponent<FoodPriceSelectProps, never> {
  render() {
    return (
      <RawFoodPriceSelect
        className={classNames("price-range-select", Classes.FILL)}
        items={allowedFoodPrices}
        filterable={false}
        itemRenderer={this.renderItem}
        noResults={"No results"}
        onItemSelect={this.props.onSelect}
      >
        <AnchorButton className="price-range-select-outer-button">
          {getFoodPriceText(this.props.priceRange) || "Select price range"}
          {this.maybeRenderClearButton()}
        </AnchorButton>
      </RawFoodPriceSelect>
    );
  }

  private renderItem: ItemRenderer<FoodPrice> = (priceRange, { modifiers, handleClick }) => {
    return (
        <MenuItem
            key={`${priceRange}`}
            active={modifiers.active}
            onClick={handleClick}
            text={getFoodPriceText(priceRange)}
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

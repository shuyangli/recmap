import { Classes, MenuItem, Button, AnchorButton } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";

import "./PriceSelect.less";

const RawPriceSelect = Select.ofType<number>();

export interface PriceSelectProps {
  priceRange?: number;
  options: number[];
  getHumanReadablePrice: (price: number) => string;
  clearable?: boolean;
  onSelect: (priceRange: number | undefined) => void;
}

export class PriceSelect extends React.PureComponent<PriceSelectProps, never> {
  render() {
    return (
      <RawPriceSelect
        className={classNames("price-range-select", Classes.FILL)}
        items={this.props.options}
        filterable={false}
        itemRenderer={this.renderItem}
        noResults={"No results"}
        onItemSelect={this.props.onSelect}
      >
        <AnchorButton className="price-range-select-outer-button">
          {this.props.getHumanReadablePrice(this.props.priceRange) || "Select price range"}
          {this.maybeRenderClearButton()}
        </AnchorButton>
      </RawPriceSelect>
    );
  }

  private renderItem: ItemRenderer<number> = (price, { modifiers, handleClick }) => {
    return (
        <MenuItem
            key={`${price}`}
            active={modifiers.active}
            onClick={handleClick}
            text={this.props.getHumanReadablePrice(price)}
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

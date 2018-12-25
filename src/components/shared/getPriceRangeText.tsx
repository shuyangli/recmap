import { PriceRange } from "../../api/interfaces";

import "./LocationRating.less";

const priceRangeToText = {
  [PriceRange.ZERO_TO_TEN]: "Less than $10",
  [PriceRange.TEN_TO_TWENTY_FIVE]: "$10 – $25",
  [PriceRange.TWENTY_FIVE_TO_FIFTY]: "$25 – $50",
  [PriceRange.OVER_FIFTY]: "Over $50",
};

export function getPriceRangeText(priceRange: PriceRange | null) {
  return priceRange != null ? priceRangeToText[priceRange] : null;
}

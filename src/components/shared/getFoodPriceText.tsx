import { FoodPrice } from "../../api/interfaces";

import "./LocationRating.less";

const foodPriceToText = {
  [FoodPrice.ZERO_TO_FIFTEEN]: "Under $15",
  [FoodPrice.FIFTEEN_TO_THIRTY]: "$15 – $30",
  [FoodPrice.THIRTY_TO_SIXTY]: "$30 – $60",
  [FoodPrice.OVER_SIXTY]: "Over $60",
};

export function getFoodPriceText(foodPrice: FoodPrice | null) {
  return foodPrice != null ? foodPriceToText[foodPrice] : null;
}

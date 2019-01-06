import { FoodPrice, DrinkPrice } from "../../api/interfaces";

export const FOOD_PRICE_OPTIONS = [
  FoodPrice.ZERO_TO_FIFTEEN,
  FoodPrice.FIFTEEN_TO_THIRTY,
  FoodPrice.THIRTY_TO_SIXTY,
  FoodPrice.OVER_SIXTY,
];

export const DRINK_PRICE_OPTIONS = [
  DrinkPrice.ZERO_TO_EIGHT,
  DrinkPrice.EIGHT_TO_FIFTEEN,
  DrinkPrice.OVER_FIFTEEN,
];

const foodPriceToText = {
  [FoodPrice.ZERO_TO_FIFTEEN]: "Under $15",
  [FoodPrice.FIFTEEN_TO_THIRTY]: "$15 – $30",
  [FoodPrice.THIRTY_TO_SIXTY]: "$30 – $60",
  [FoodPrice.OVER_SIXTY]: "Over $60",
};

export function getFoodPriceText(foodPrice: FoodPrice | null) {
  return foodPrice != null ? foodPriceToText[foodPrice] : null;
}

const drinkPriceToText = {
  [DrinkPrice.ZERO_TO_EIGHT]: "Under $8",
  [DrinkPrice.EIGHT_TO_FIFTEEN]: "$8 – $15",
  [DrinkPrice.OVER_FIFTEEN]: "Over $15",
};

export function getDrinkPriceText(drinkPrice: DrinkPrice | null) {
  return drinkPrice != null ? drinkPriceToText[drinkPrice] : null;
}

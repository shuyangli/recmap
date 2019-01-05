import * as classNames from "classnames";
import * as React from "react";
import { Rating, FoodPrice, DrinkPrice } from "../../api/interfaces";
import { LocationRating } from ".";
import { getFoodPriceText } from "./getFoodPriceText";

import "./RatingAndPrice.less";

export function RatingAndPrice(props: {
  className?: string;
  rating?: Rating;
  foodPrice?: FoodPrice;
  drinkPrice?: DrinkPrice;
}) {
  return (
    <div className={classNames(props.className, "location-rating-and-price")}>
      <LocationRating rating={props.rating} />
      {props.rating != null && props.foodPrice != null && (
        <div className="location-middot">·</div>
      )}
      <div className="location-price-range">{getFoodPriceText(props.foodPrice)}</div>
    </div>
  );
}

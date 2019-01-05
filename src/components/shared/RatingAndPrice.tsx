import * as React from "react";
import { Location } from "../../api/interfaces";
import { LocationRating } from ".";
import { getFoodPriceText } from "./getFoodPriceText";

import "./RatingAndPrice.less";

export function RatingAndPrice(props: { location: Location }) {
  return (
    <div className="location-rating-and-price">
      <LocationRating rating={props.location.computedRating} />
      {props.location.computedRating != null && props.location.computedFoodPrice != null && (
        <div className="location-middot">·</div>
      )}
      <div className="location-price-range">{getFoodPriceText(props.location.computedFoodPrice)}</div>
    </div>
  );
}

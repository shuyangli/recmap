import * as React from "react";
import { Location } from "../../api/interfaces";
import { LocationRating } from ".";
import { getPriceRangeText } from "./getPriceRangeText";

import "./RatingAndPrice.less";

export function RatingAndPrice(props: { location: Location }) {
  return (
    <div className="location-rating-and-price">
      <LocationRating rating={props.location.rating} />
      {props.location.rating != null && props.location.priceRange != null && <div className="location-middot">·</div>}
      <div className="location-price-range">{getPriceRangeText(props.location.priceRange)}</div>
    </div>
  );
}

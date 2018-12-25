import * as React from "react";
import { Location } from "../../api/interfaces";
import { LocationRating } from ".";
import { getPriceRangeText } from "./getPriceRangeText";

export function RatingAndPrice(props: { location: Location }) {
  return (
    <div className="location-rating-and-price">
      <LocationRating rating={props.location.rating} />
      <div className="location-price-range">{getPriceRangeText(props.location.priceRange)}</div>
    </div>
  );
}

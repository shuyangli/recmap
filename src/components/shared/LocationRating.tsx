import { Colors, Icon } from "@blueprintjs/core";
import * as React from "react";

import { Rating } from "../../api/interfaces";

import "./LocationRating.less";

const THUMBS_UP = (<Icon className="location-rating-icon" icon="thumbs-up" />);
const THUMBS_DOWN = (<Icon className="location-rating-icon" icon="thumbs-down" />);

const ratingToColor = {
  [Rating.BAD]: Colors.RED1,
  [Rating.NEUTRAL]: Colors.ORANGE1,
  [Rating.GOOD]: Colors.GREEN1,
  [Rating.GREAT]: Colors.GREEN1,
};

const ratingToElements = {
  [Rating.BAD]: THUMBS_DOWN,
  [Rating.NEUTRAL]: "~",
  [Rating.GOOD]: THUMBS_UP,
  [Rating.GREAT]: <>{THUMBS_UP}{THUMBS_UP}</>,
};

interface Props {
  rating?: Rating;
}

export function LocationRating(props: Props): JSX.Element {
  return props.rating != null ? (
    <div className="location-rating" style={{ color: ratingToColor[props.rating] }}>
      {ratingToElements[props.rating]}
    </div>
  ) : null;
}

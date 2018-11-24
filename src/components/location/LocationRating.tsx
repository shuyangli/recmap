import { Colors, Icon } from "@blueprintjs/core";
import * as React from "react";

import "./LocationRating.less";

const THUMBS_UP = (<Icon className="location-rating-icon" icon="thumbs-up" />);
const THUMBS_DOWN = (<Icon className="location-rating-icon" icon="thumbs-down" />);

// These are not actually in an array
// tslint:disable:jsx-key
const RATING_MAP = [
  <div className="location-rating" style={{ color: Colors.RED1 }}>{THUMBS_DOWN}</div>,
  <div className="location-rating" style={{ color: Colors.ORANGE1 }}>~</div>,
  <div className="location-rating" style={{ color: Colors.GREEN1 }}>{THUMBS_UP}</div>,
  <div className="location-rating" style={{ color: Colors.GREEN1 }}>{THUMBS_UP}{THUMBS_UP}</div>,
];
// tslint:enable:jsx-key

interface Props {
  rating?: number;
}

export function LocationRating(props: Props) {
  return props.rating != null ? RATING_MAP[props.rating] : null;
}

import { Icon, IconClasses } from "@blueprintjs/core";
import * as React from "react";

const THUMBS_UP = (<Icon iconName={IconClasses.THUMBS_UP} />);
const THUMBS_DOWN = (<Icon iconName={IconClasses.THUMBS_DOWN} />);

const RATING_MAP = [
  <div className="location-rating">{THUMBS_DOWN}</div>,
  <div className="location-rating">"~"</div>,
  <div className="location-rating">{THUMBS_UP}</div>,
  <div className="location-rating">{THUMBS_UP}{THUMBS_UP}</div>,
];

interface Props {
  rating?: number
}

export function LocationRating(props: Props) {
  return props.rating ? RATING_MAP[props.rating] : null;
}

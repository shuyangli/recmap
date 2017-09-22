import * as React from "react";
import { Tag } from "@blueprintjs/core";

import "./LocationTags.less";

interface Props {
  tags: string[];
  showNumberOfTags?: number;
}

export function LocationTags(props: Props) {
  let displayedTags: string[];
  if (props.showNumberOfTags != null && props.tags.length > props.showNumberOfTags) {
    displayedTags = props.tags.slice(0, props.showNumberOfTags);
  } else {
    displayedTags = props.tags;
  }

  const remainingTagsCount = props.tags.length - displayedTags.length;

  return (
    <div className="location-tags">
      {displayedTags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      {remainingTagsCount > 0 && `+${remainingTagsCount}`}
    </div>
  );
}

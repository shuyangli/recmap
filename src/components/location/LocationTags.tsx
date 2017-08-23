import * as React from "react";
import * as _ from "lodash";
import { Tag } from "@blueprintjs/core";

import "./LocationTags.less";

interface Props {
  tags: string[];
}

export function LocationTags(props: Props) {
  return !_.isEmpty(props.tags) && (
    <div className="location-tags">
      {props.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
    </div>
  );
}

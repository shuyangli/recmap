import { Classes, MenuItem } from "@blueprintjs/core";
import { MultiSelect, ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import * as classNames from "classnames";

import { backendApi } from "../../api/BackendApi";

const RawTagSelect = MultiSelect.ofType<string>();

interface State {
  allTags: string[];
}

export interface TagSelectProps {
  onSelect: (tag: string) => void;
  onDeselectAtIndex: (idx: number) => void;
  selectedTags: string[];
}

export class TagSelect extends React.PureComponent<TagSelectProps, State> {
  state: State = {
    allTags: [],
  };

  componentDidMount() {
    backendApi.getAllTags().then((allTags) => this.setState({ allTags }));
  }

  render() {
    return (
      <RawTagSelect
        className={classNames("tag-select", Classes.FILL)}
        items={this.state.allTags}
        itemPredicate={filterTags}
        itemRenderer={this.renderItem}
        tagRenderer={renderTag}
        noResults={"No results"}
        onItemSelect={this.props.onSelect}
        placeholder="Filter by tags..."
        selectedItems={this.props.selectedTags}
        tagInputProps={{
          tagProps: { minimal: true },
          onRemove: this.onDeselect,
        }}
      />
    );
  }

  private renderItem: ItemRenderer<string> = (tag, { modifiers, handleClick }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            active={modifiers.active}
            key={tag}
            onClick={handleClick}
            text={tag}
            shouldDismissPopover={false}
        />
    );
  }

  private onDeselect = (tag: string, index: number) => {
    this.props.onDeselectAtIndex(index);
  }
}

const filterTags: ItemPredicate<string> = (query, tag) => {
  return tag.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderTag = (tag: string) => tag;

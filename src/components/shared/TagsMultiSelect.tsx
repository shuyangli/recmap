import { Classes, MenuItem, Button } from "@blueprintjs/core";
import { MultiSelect, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import * as React from "react";
import { connect } from "react-redux";
import * as classNames from "classnames"
import { TypedDispatch } from "../../store/TypedDispatch";
import { getAllTags } from "../../store/locations/actions";

import "./TagsMultiSelect.less";

const RawTagsMultiSelect = MultiSelect.ofType<string>();

interface OwnProps {
  tags: string[];
  onSelect: (tags: string[]) => void;
}

interface DispatchProps {
  getAllTags: () => Promise<string[]>;
}

type TagsMultiSelectProps = OwnProps & DispatchProps;

interface State {
  allTags: string[];
}

class TagsMultiSelect extends React.PureComponent<TagsMultiSelectProps, State> {
  constructor(props: TagsMultiSelectProps) {
    super(props);
    this.state = { allTags: [] };
  }

  render() {
    const clearButton = this.props.tags.length > 0 ? (
      <Button icon="cross" minimal={true} onClick={this.handleClear} />
    ) : null;

    return (
      <RawTagsMultiSelect
        className={classNames("tags-multi-select", Classes.FILL)}
        activeItem={null}
        popoverProps={{
          targetTagName: "div",
          popoverClassName: "tags-multi-select-container",
          minimal: true,
        }}
        items={this.state.allTags}
        selectedItems={this.props.tags}
        itemRenderer={this.renderItem}
        itemPredicate={tagPredicate}
        tagRenderer={this.renderTag}
        createNewItemFromQuery={this.createTag}
        onRemove={this.handleTagRemove}
        noResults={(
          <MenuItem
            text={"Press Enter to create tag"}
            shouldDismissPopover={false}
          />
        )}
        onItemSelect={this.handleTagSelect}
        tagInputProps={{
          tagProps: { minimal: true },
          rightElement: clearButton,
        }}
      />
    );
  }

  componentDidMount() {
    this.props.getAllTags().then((allTags) => {
      this.setState({ allTags });
    });
  }

  private renderItem: ItemRenderer<string> = (tag, { modifiers, handleClick }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
          key={tag}
          onClick={handleClick}
          text={tag}
          shouldDismissPopover={false}
      />
    );
  }

  private renderTag = (tag: string) => tag;

  private addTag = (tag: string) => {
    if (!this.isTagSelected(tag)) {
      this.props.onSelect([...this.props.tags, tag]);
    }
  }

  private createTag = (tag: string) => {
    return tag;
  }

  private removeTag = (tagIndex: number) => {
    if (tagIndex < this.props.tags.length) {
      this.props.onSelect(this.props.tags.filter((tag, idx) => idx !== tagIndex));
    }
  }

  private getSelectedTagIndex = (tag: string) => {
    return this.props.tags.indexOf(tag);
  }

  private isTagSelected = (tag: string) => {
    return this.getSelectedTagIndex(tag) !== -1;
  }

  private handleTagSelect = (tag: string) => {
    if (this.isTagSelected(tag)) {
      this.removeTag(this.getSelectedTagIndex(tag));
    } else {
      this.addTag(tag);
    }
  }

  private handleTagRemove = (tag: string, idx: number) => {
    this.removeTag(idx);
  }

  private handleClear = () => {
    this.props.onSelect([]);
  }
}

const tagPredicate: ItemPredicate<string> = (query, tag) => {
  return tag.toLowerCase().match(`.*${query.toLowerCase()}.*`) != null;
};

const mapDispatchToProps = (dispatch: TypedDispatch): DispatchProps => ({
  getAllTags: () => dispatch(getAllTags()),
});

export const ConnectedTagsMultiSelect = connect(null, mapDispatchToProps)(TagsMultiSelect);

import { Classes } from "@blueprintjs/core";
import * as React from "react";
import * as classNames from "classnames"
import { Rating, FoodPrice, DrinkPrice, LocationReview } from "../../api/interfaces";
import {
  RatingSelect,
  PriceSelect,
  getFoodPriceText,
  FOOD_PRICE_OPTIONS,
  DRINK_PRICE_OPTIONS,
  getDrinkPriceText,
} from "../shared";

import "./SharedEntryStyles.less";
import "./ReviewEditor.less";

export interface ReviewEditorState {
  rating?: Rating;
  foodPrice?: FoodPrice;
  drinkPrice?: DrinkPrice;
  notes?: string;
  order?: string;
  avoid?: string;
}

interface OwnProps {
  editorState: ReviewEditorState;
  onStateUpdate: (editorState: ReviewEditorState) => void;
}

type ReviewEditorProps = OwnProps;

export class ReviewEditor extends React.PureComponent<ReviewEditorProps, never> {
  public static convertReviewToEditorState(review?: LocationReview): ReviewEditorState {
    return { ...review };
  }

  public static convertEditorStateToReview(editorState: ReviewEditorState): LocationReview {
    if (!ReviewEditor.isEditorStateComplete(editorState)) {
      throw new Error("Some required fields in editorState are missing");
    }
    return { ...editorState } as LocationReview;
  }

  public static isEditorStateComplete(editorState: ReviewEditorState): boolean {
    return editorState.rating != null;
  }

  render() {
    return (
      <div className="review-editor">
        <div className="location-editor-entry">
          <div className="location-editor-heading">Rating</div>
          <RatingSelect rating={this.props.editorState.rating} onSelect={this.onRatingChange} />
        </div>

        <div className="location-editor-entry">
          <div className="location-editor-heading">Meal Price</div>
          <PriceSelect
            priceRange={this.props.editorState.foodPrice}
            options={FOOD_PRICE_OPTIONS}
            getHumanReadablePrice={getFoodPriceText}
            onSelect={this.onFoodPriceChange}
            clearable={true}
          />
        </div>

        <div className="location-editor-entry">
          <div className="location-editor-heading">Drink Price</div>
          <PriceSelect
            priceRange={this.props.editorState.drinkPrice}
            options={DRINK_PRICE_OPTIONS}
            getHumanReadablePrice={getDrinkPriceText}
            onSelect={this.onDrinkPriceChange}
            clearable={true}
          />
        </div>

        <div className="location-editor-entry">
          <div className="location-editor-heading">Notes</div>
          <textarea
            className={classNames(Classes.INPUT, Classes.FILL, "location-notes")}
            value={this.props.editorState.notes}
            placeholder="Notes"
            onChange={this.onNotesChange}
          />
        </div>

        <div className="location-editor-entry">
          <div className="location-editor-heading">What to Order</div>
          <textarea
            className={classNames(Classes.INPUT, Classes.FILL, "location-to-order")}
            value={this.props.editorState.order}
            placeholder="What to order at this place"
            onChange={this.onOrderChange}
          />
        </div>

        <div className="location-editor-entry">
          <div className="location-editor-heading">What to Avoid</div>
          <textarea
            className={classNames(Classes.INPUT, Classes.FILL, "location-to-avoid")}
            value={this.props.editorState.avoid}
            placeholder="What to avoid at this place"
            onChange={this.onAvoidChange}
          />
        </div>
      </div>
    );
  }

  private updateReview(partial: Partial<ReviewEditorState>) {
    this.props.onStateUpdate({ ...this.props.editorState, ...partial });
  }

  private onRatingChange = (rating: Rating | undefined) => {
    this.updateReview({ rating });
  }

  private onFoodPriceChange = (foodPrice: FoodPrice | undefined) => {
    this.updateReview({ foodPrice });
  }

  private onDrinkPriceChange = (drinkPrice: DrinkPrice | undefined) => {
    this.updateReview({ drinkPrice });
  }

  private onNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.updateReview({ notes: event.target.value });
  }

  private onOrderChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.updateReview({ order: event.target.value });
  }

  private onAvoidChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.updateReview({ avoid: event.target.value });
  }
}

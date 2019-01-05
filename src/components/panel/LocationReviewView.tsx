import * as React from "react";
import { connect } from "react-redux";
import { LocationReview, UserRecord } from "../../api/interfaces";
import { RootState } from "../../store/RootState";
import { authorsSelector } from "../../store/user/selectors";
import { LocationRating, getFoodPriceText, getDrinkPriceText } from "../shared";

import "./LocationReviewView.less";

interface OwnProps {
  review: LocationReview;
  uid: string;
}

interface ConnectedProps {
  authors: { [uid: string]: UserRecord };
}

type LocationReviewProps = OwnProps & ConnectedProps;

class LocationReviewView extends React.PureComponent<LocationReviewProps, never> {
  render() {
    const review = this.props.review;
    const authorRecord = this.props.authors[this.props.uid];
    return (
      <div className="location-review">
        {authorRecord && (
          <div className="location-review-attribution">Review from {authorRecord.displayName}:</div>
        )}
        {this.maybeRenderEntry("Rating", <LocationRating rating={review.rating} />)}
        {this.maybeRenderEntry("Average meal cost", getFoodPriceText(review.foodPrice))}
        {this.maybeRenderEntry("Average drink cost", getDrinkPriceText(review.drinkPrice))}
        {this.maybeRenderEntry("Notes", review.notes)}
        {this.maybeRenderEntry("What to order", review.order)}
        {this.maybeRenderEntry("What to avoid", review.avoid)}
      </div>
    );
  }

  private maybeRenderEntry(heading: string, notes?: React.ReactNode) {
    return notes && (
      <div className="location-entry">
        <span className="location-entry-heading">{heading}</span>
        <span className="notes">{notes}</span>
      </div>
    );
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    authors: authorsSelector(state),
  };
}

export const ConnectedLocationReviewView = connect(mapStateToProps)(LocationReviewView);

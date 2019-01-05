import * as React from "react";
import { connect } from "react-redux";
import * as firebase from "firebase";
import { LocationReview, UserRecord } from "../../api/interfaces";
import { RootState } from "../../store/RootState";
import { authorsSelector, isAdminSelector } from "../../store/user/selectors";
import { LocationRating, getFoodPriceText, getDrinkPriceText } from "../shared";

import "./LocationReviewView.less";
import { Button } from "@blueprintjs/core";
import { TypedDispatch } from "../../store/TypedDispatch";
import { OpenEditReviewPanel } from "../../store/actionPanel/actions";

interface OwnProps {
  locationId: string;
  review: LocationReview;
  uid: string;
}

interface ConnectedProps {
  authors: { [uid: string]: UserRecord };
  isAdmin: boolean;
}

interface DispatchProps {
  onEditReview: () => void;
}

type LocationReviewProps = OwnProps & ConnectedProps & DispatchProps;

class LocationReviewView extends React.PureComponent<LocationReviewProps, never> {
  render() {
    const review = this.props.review;
    const authorRecord = this.props.authors[this.props.uid];
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser ? currentUser.uid : undefined;
    return (
      <div className="location-review">
        {authorRecord && (
          <div className="location-review-attribution">
            Review from {authorRecord.displayName}:
            {currentUid === this.props.uid && this.props.isAdmin && (
              <Button
                className="location-review-edit-button"
                small={true}
                minimal={true}
                icon="edit"
                onClick={this.props.onEditReview}
              />
            )}
          </div>
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
    isAdmin: isAdminSelector(state),
  };
}

function mapDispatchToProps(dispatch: TypedDispatch, ownProps: OwnProps): DispatchProps {
  return {
    onEditReview: () => dispatch(OpenEditReviewPanel.create({ locationId: ownProps.locationId })),
  };
}

export const ConnectedLocationReviewView = connect(mapStateToProps, mapDispatchToProps)(LocationReviewView);

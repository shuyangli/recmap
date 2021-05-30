import * as React from "react";
import { connect } from "react-redux";
import firebase from "firebase/app";
import { LocationReview } from "../../api/interfaces";
import { RootState } from "../../store/RootState";
import { isAdminSelector } from "../../store/user/selectors";
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
  isAdmin: boolean;
}

interface DispatchProps {
  onEditReview: () => void;
}

type LocationReviewProps = OwnProps & ConnectedProps & DispatchProps;

class LocationReviewView extends React.PureComponent<LocationReviewProps, never> {
  render() {
    const review = this.props.review;
    const currentUser = firebase.auth().currentUser;
    const currentUid = currentUser ? currentUser.uid : undefined;
    return (
      <div className="location-review">
        <div className="location-review-attribution">
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
        <span className="location-review-heading">{heading}</span>
        <span className="notes">{notes}</span>
      </div>
    );
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    isAdmin: isAdminSelector(state),
  };
}

function mapDispatchToProps(dispatch: TypedDispatch, ownProps: OwnProps): DispatchProps {
  return {
    onEditReview: () => dispatch(OpenEditReviewPanel.create({ locationId: ownProps.locationId })),
  };
}

export const ConnectedLocationReviewView = connect(mapStateToProps, mapDispatchToProps)(LocationReviewView);

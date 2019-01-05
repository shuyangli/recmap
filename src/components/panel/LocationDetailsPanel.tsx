import { AnchorButton, Button, Tooltip } from "@blueprintjs/core";
import { map } from "lodash-es";
import * as firebase from "firebase";
import * as React from "react";
import { connect } from "react-redux";
import { Location } from "../../api/interfaces";
import { ToggleEditPanel, ClosePanel, OpenEditReviewPanel } from "../../store/actionPanel/actions";
import { TypedDispatch } from "../../store/TypedDispatch";
import { getGoogleMapsUrl } from "../../store/locations/actions";
import { RootState } from "../../store/RootState";
import { isAdminSelector } from "../../store/user/selectors";
import { ConnectedLocationReviewView } from "./LocationReviewView";
import { LocationDetailView } from "./LocationDetailView";

import "./LocationDetailsPanel.less";

interface OwnProps {
  locationId: string;
}

interface ConnectedProps {
  location: Location;
  isAdmin: boolean;
}

interface DispatchProps {
  onEdit: () => void;
  closePanel: () => void;
  addReview: () => void;
  getGoogleMapsUrl: (placeId: string) => Promise<string>;
}

type LocationDetailsPanelProps = OwnProps & ConnectedProps & DispatchProps;

interface State {
  googleMapsUrl?: string;
}

class LocationDetailsPanel extends React.PureComponent<LocationDetailsPanelProps, State> {
  constructor(props: LocationDetailsPanelProps) {
    super(props);
    this.state = { googleMapsUrl: undefined };
  }

  componentDidMount() {
    this.updateUrl(this.props.location);
  }

  componentWillReceiveProps(nextProps: LocationDetailsPanelProps) {
    if (nextProps.location !== this.props.location) {
      this.updateUrl(nextProps.location);
    }
  }

  render() {
    const location = this.props.location;
    return (
      <div className="location-panel">
        <LocationDetailView
          location={location}
          renderActions={this.renderActions}
        />
        {map(location.reviews, (review, uid) => (
          <ConnectedLocationReviewView key={uid} locationId={this.props.location.id} review={review} uid={uid} />
        ))}
        {this.maybeRenderAddReviewButton()}
      </div>
    );
  }

  private renderActions = () => {
    return (
      <>
        {this.state.googleMapsUrl && (
          <Tooltip content="Open in Google Maps">
            <AnchorButton
              small={true}
              minimal={true}
              icon="share"
              href={this.state.googleMapsUrl}
              target="_blank"
            />
          </Tooltip>
        )}
        {this.props.isAdmin && (
          <Button small={true} minimal={true} icon="edit" onClick={this.props.onEdit} />
        )}
        <Button small={true} minimal={true} icon="cross" onClick={this.props.closePanel} />
      </>
    );
  }

  private maybeRenderAddReviewButton() {
    const currentUser = firebase.auth().currentUser;
    const uid = currentUser ? currentUser.uid : undefined;
    if (uid && this.props.isAdmin && this.props.location.reviews[uid] == null) {
      return (
        <div className="location-panel-add-review-button-wrapper">
          <Button minimal={true} icon="add" text="Add Your Review" onClick={this.props.addReview} />
        </div>
      );
    } else {
      return null;
    }
  }

  private async updateUrl(location: Location) {
    this.setState({ googleMapsUrl: undefined });
    if (location.googlePlaceId) {
      const googleMapsUrl = await this.props.getGoogleMapsUrl(location.googlePlaceId);
      this.setState({ googleMapsUrl });
    }
  }
}

function mapStateToProps(state: RootState, ownProps: OwnProps): ConnectedProps {
  return {
    isAdmin: isAdminSelector(state),
    location: state.location.locations[ownProps.locationId],
  };
}

function mapDispatchToProps(dispatch: TypedDispatch, ownProps: OwnProps): DispatchProps {
  return {
    onEdit: () => dispatch(ToggleEditPanel.create({ locationId: ownProps.locationId })),
    closePanel: () => dispatch(ClosePanel.create()),
    addReview: () => dispatch(OpenEditReviewPanel.create({ locationId: ownProps.locationId })),
    getGoogleMapsUrl: (placeId: string) => dispatch(getGoogleMapsUrl(placeId)),
  };
}

export const ConnectedLocationDetailsPanel = connect(mapStateToProps, mapDispatchToProps)(LocationDetailsPanel);

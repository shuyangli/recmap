import { H2, AnchorButton, Button, Tooltip } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";

import { RatingAndPrice } from "../shared";
import { Location } from "../../api/interfaces";
import { LocationTags } from "../shared";
import { ToggleEditPanel, ClosePanel } from "../../store/actionPanel/actions";
import { TypedDispatch } from "../../store/TypedDispatch";

import "./LocationDetailsPanel.less";
import { getGoogleMapsUrl } from "../../store/locations/actions";
import { RootState } from "../../store/RootState";
import { isAdminSelector } from "../../store/user/selectors";

interface OwnProps {
  location: Location;
}

interface ConnectedProps {
  isAdmin: boolean;
}

interface DispatchProps {
  onEdit: (locationId: string) => void;
  closePanel: () => void;
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
        <div className="location-content-wrapper">
          <div className="location-entry aligned name-and-link">
            <H2 className="location-name">{location.name}</H2>
            <div className="location-panel-buttons">
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
                <Button small={true} minimal={true} icon="edit" onClick={this.onEdit} />
              )}
              <Button small={true} minimal={true} icon="cross" onClick={this.props.closePanel} />
            </div>
          </div>
          <div className="location-entry location-address">{location.address}</div>

          <div className="location-entry aligned">
            <RatingAndPrice location={location} />
          </div>
          <LocationTags tags={location.tags} />
          {location.notes && <>
            {this.maybeRenderNotes("Notes", location.notes.notes)}
            {this.maybeRenderNotes("What to Order", location.notes.order)}
            {this.maybeRenderNotes("What to Avoid", location.notes.avoid)}
          </>}
        </div>
      </div>
    );
  }

  private maybeRenderNotes(heading: string, notes?: string) {
    return notes && (
      <div className="location-entry">
        <span className="notes-heading">{heading}</span>
        <span className="notes">{notes}</span>
      </div>
    );
  }

  private onEdit = () => this.props.onEdit(this.props.location.id);

  private async updateUrl(location: Location) {
    this.setState({ googleMapsUrl: undefined });
    if (location.googlePlaceId) {
      const googleMapsUrl = await this.props.getGoogleMapsUrl(location.googlePlaceId);
      this.setState({ googleMapsUrl });
    }
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    isAdmin: isAdminSelector(state),
  };
}

function mapDispatchToProps(dispatch: TypedDispatch): DispatchProps {
  return {
    onEdit: (locationId: string) => dispatch(ToggleEditPanel.create({ locationId })),
    closePanel: () => dispatch(ClosePanel.create()),
    getGoogleMapsUrl: (placeId: string) => dispatch(getGoogleMapsUrl(placeId)),
  };
}

export const ConnectedLocationDetailsPanel = connect(mapStateToProps, mapDispatchToProps)(LocationDetailsPanel);

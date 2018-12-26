import { H2, AnchorButton } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";

import { RatingAndPrice } from "../shared";
import { Location } from "../../api/interfaces";
import { LocationTags } from "../shared";
import { ToggleEditPanel } from "../../store/actionPanel/actions";
import { TypedDispatch } from "../../store/TypedDispatch";

import "./LocationDetailsPanel.less";
import { getGoogleMapsUrl } from "../../store/locations/actions";

interface OwnProps {
  location: Location;
}

interface DispatchProps {
  onEdit: (locationId: string) => void;
  getGoogleMapsUrl: (placeId: string) => Promise<string>;
}

type LocationDetailsPanelProps = OwnProps & DispatchProps;

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
            {this.state.googleMapsUrl && (
              <AnchorButton small={true} minimal={true} icon="share" href={this.state.googleMapsUrl} target="_blank" />
            )}
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

  // private onEdit = () => this.props.onEdit(this.props.location.id);

  private async updateUrl(location: Location) {
    this.setState({ googleMapsUrl: undefined });
    if (location.googlePlaceId) {
      const googleMapsUrl = await this.props.getGoogleMapsUrl(location.googlePlaceId);
      this.setState({ googleMapsUrl });
    }
  }
}

function mapDispatchToProps(dispatch: TypedDispatch): DispatchProps {
  return {
    onEdit: (locationId: string) => dispatch(ToggleEditPanel.create({ locationId })),
    getGoogleMapsUrl: (placeId: string) => dispatch(getGoogleMapsUrl(placeId)),
  };
}

export const ConnectedLocationDetailsPanel: React.ComponentClass<OwnProps> =
  connect<void, DispatchProps, OwnProps>(null, mapDispatchToProps)(LocationDetailsPanel as any);

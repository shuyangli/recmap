import { Button, Classes, Intent } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { Location, Rating, PriceRange, LocationReview } from "../../api/interfaces";
import { ClosePanel, ToggleDetailPanel, ToggleEditPanel } from "../../store/actionPanel/actions";
import { createOrUpdateLocation, deleteLocation } from "../../store/locations/actions";
import { TypedDispatch } from "../../store/TypedDispatch";
import { RatingSelect } from "../shared/RatingSelect";
import { PriceRangeSelect } from "../shared/PriceRangeSelect";

import "./EditLocationPanel.less";
import { getCurrentPosition } from "../../api/MapsApi";

interface OwnProps {
  initialLocation?: Location;
}

interface DispatchProps {
  onCancel: (locationId?: string) => void;
  onSave: (location: Location, initialLocation?: Location) => void;
  onDelete: (locationId: string) => void;
}

interface State {
  isLoadingCurrentLocation: boolean;
  location: Location;
  isSaving: boolean;
}

type EditLocationPanelProps = OwnProps & DispatchProps;

class EditLocationPanel extends React.PureComponent<EditLocationPanelProps, State> {
  constructor(props: EditLocationPanelProps) {
    super(props);
    this.state = {
      isLoadingCurrentLocation: false,
      location: props.initialLocation || {
        name: "",
        address: "",
        latitude: 0,
        longitude: 0,
        notes: {},
        tags: [],
      },
      isSaving: false,
    };
    if (props.initialLocation.notes == null) {
      this.state.location.notes = {};
    }
  }

  private nameInput: HTMLInputElement;
  private addressInput: HTMLInputElement;
  private addressAutocomplete: google.maps.places.Autocomplete;
  private nameAutocomplete: google.maps.places.Autocomplete;

  private setupNameInput() {
    this.nameAutocomplete = new google.maps.places.Autocomplete(this.nameInput, {
      types: ["establishment"],
    });
    this.nameAutocomplete.addListener("place_changed", () => {
      const place = this.nameAutocomplete.getPlace();
      const name = place.name;
      if (place.place_id) {
        const locationUpdates: Partial<Location> = {
          name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          googlePlaceId: place.place_id,
        };
        this.setState({ location: { ...this.state.location, ...locationUpdates } });
      } else {
        this.setState({ location: { ...this.state.location, name }});
      }
    });
  }

  private setupAddressInput() {
    this.addressAutocomplete = new google.maps.places.Autocomplete(this.addressInput, {
      types: ["geocode"],
    });
    this.addressAutocomplete.addListener("place_changed", () => {
      const place = this.addressAutocomplete.getPlace();
      const locationUpdates: Partial<Location> = {
        address: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };
      this.setState({ location: { ...this.state.location, ...locationUpdates }});
    });
  }

  componentDidMount() {
    this.setupNameInput();
    this.setupAddressInput();

    this.setState({ isLoadingCurrentLocation: true });
    getCurrentPosition().then((position) => {
      this.setState({ isLoadingCurrentLocation: false });

      const location: google.maps.LatLngLiteral = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const circle = new google.maps.Circle({ center: location });
      this.addressAutocomplete.setBounds(circle.getBounds());
      this.nameAutocomplete.setBounds(circle.getBounds());
    });
  }

  render() {
    return (
      <div className="edit-location-panel">
        <div className="location-content-wrapper">

          <div className="edit-location-panel-entry">
            <div className="edit-location-panel-heading">Name</div>
            <input
              disabled={this.state.isLoadingCurrentLocation}
              className={classNames(Classes.INPUT, Classes.FILL, "location-name")}
              value={this.state.location.name}
              ref={(element) => this.nameInput = element}
              placeholder="Name"
              onChange={this.onNameChange}
            />
          </div>

          <div className="edit-location-panel-entry">
            <div className="edit-location-panel-heading">Address</div>
            <input
              disabled={this.state.isLoadingCurrentLocation}
              className={classNames(Classes.INPUT, Classes.FILL, "location-address")}
              value={this.state.location.address}
              placeholder="Address"
              ref={(element) => this.addressInput = element}
              onChange={this.onAddressChange}
            />
          </div>

          <div className="edit-location-panel-entry inline-entry">
            <div className="edit-location-panel-heading">Rating</div>
            <RatingSelect rating={this.state.location.rating} onSelect={this.onRatingChange} />
          </div>

          <div className="edit-location-panel-entry inline-entry">
            <div className="edit-location-panel-heading">Price Range</div>
            <PriceRangeSelect priceRange={this.state.location.priceRange} onSelect={this.onPriceRangeChange} />
          </div>

          <div className="edit-location-panel-entry">
            <div className="edit-location-panel-heading">Notes</div>
            <textarea
              className={classNames(Classes.INPUT, Classes.FILL, "location-notes")}
              value={this.state.location.notes.notes}
              placeholder="Notes"
              onChange={this.onNotesChange}
            />
          </div>

          <div className="edit-location-panel-entry">
            <div className="edit-location-panel-heading">What to Order</div>
            <textarea
              className={classNames(Classes.INPUT, Classes.FILL, "location-to-order")}
              value={this.state.location.notes.order}
              placeholder="What to order at this place"
              onChange={this.onToOrderChange}
            />
          </div>

          <div className="edit-location-panel-entry">
            <div className="edit-location-panel-heading">What to Avoid</div>
            <textarea
              className={classNames(Classes.INPUT, Classes.FILL, "location-to-avoid")}
              value={this.state.location.notes.avoid}
              placeholder="What to avoid at this place"
              onChange={this.onToAvoidChange}
            />
          </div>
        </div>

        <div className="edit-location-panel-edit-controls">
          <Button text="Cancel" onClick={this.cancelEdit} />
          <div className="right-group">
            {this.state.location.id && <Button text="Delete" intent={Intent.DANGER} onClick={this.deleteLocation} />}
            <Button text="Save" intent={Intent.SUCCESS} onClick={this.saveEdit} />
          </div>
        </div>
      </div>
    );
  }

  private updateLocation(partial: Partial<Location>) {
    this.setState({
      location: { ...this.state.location,  ...partial },
    });
  }

  private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.updateLocation({ name: event.target.value });
  }

  private onAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.updateLocation({ address: event.target.value });
  }

  private onRatingChange = (rating: Rating) => {
    this.updateLocation({ rating });
  }

  private onPriceRangeChange = (priceRange: PriceRange) => {
    this.updateLocation({ priceRange });
  }

  private updateReview = (change: Partial<LocationReview>) => {
    this.updateLocation({
      notes: { ...this.state.location.notes, ...change },
    });
  }
  private onNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.updateReview({ notes: event.target.value });
  }
  private onToOrderChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.updateReview({ order: event.target.value });
  }
  private onToAvoidChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.updateReview({ avoid: event.target.value });
  }

  private cancelEdit = () => this.props.onCancel(this.state.location.id);
  private saveEdit = () => this.props.onSave(this.state.location, this.props.initialLocation);
  private deleteLocation = () => this.props.onDelete(this.state.location.id);
}

const mapDispatchToProps = (dispatch: TypedDispatch): DispatchProps => ({
  onCancel: (locationId?: string) =>
    dispatch(locationId
      ? ToggleDetailPanel.create({ locationId })
      : ToggleEditPanel.create({})),

  onSave: (location: Location, initialLocation?: Location) =>
    dispatch(createOrUpdateLocation(location, initialLocation))
    .then((action) => dispatch(ToggleDetailPanel.create({ locationId: action.payload.location.id }))),

  onDelete: (locationId: string) =>
    dispatch(deleteLocation(locationId))
    .then(() => dispatch(ClosePanel.create())),
});

export const ConnectedEditLocationPanel: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(EditLocationPanel);

import { Button, Classes, Intent } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import * as Select from "react-select";
import {} from "@types/googlemaps"; // maps type hack

import { backendApi } from "@src/api/BackendApi";
import { Location } from "@src/api/interfaces";
import { ClosePanel, ToggleDetailPanel, ToggleEditPanel } from "@src/store/actionPanel/actions";
import { createOrUpdateLocation, deleteLocation } from "@src/store/locations/actions";
import { RootState } from "@src/store/store";

import "./EditLocationPanel.less";

interface OwnProps {
  initialLocation?: Location;
}

interface ConnectedProps {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

interface DispatchProps {
  onCancel: (locationId?: string) => void;
  onSave: (location: Location, initialLocation?: Location) => void;
  onDelete: (locationId: string) => void;
}

interface State {
  location: Location;
  allTags: string[];
  isSaving: boolean;
}

class EditLocationPanel extends React.PureComponent<OwnProps & ConnectedProps & DispatchProps, State> {
  state: State = {
    location: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      notes: "",
      tags: [],
    },
    allTags: [],
    isSaving: false,
  };

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

  componentWillMount() {
    if (this.props.initialLocation) {
      this.setState({
        location: { ...this.props.initialLocation },
      });
    }
    backendApi.getAllTags().then((allTags) => this.setState({ allTags }));
  }

  componentDidMount() {
    this.setupNameInput();
    this.setupAddressInput();

    const location = {
      lat: this.props.currentLocation.latitude,
      lng: this.props.currentLocation.longitude,
    };
    const circle = new google.maps.Circle({ center: location });

    this.addressAutocomplete.setBounds(circle.getBounds());
    this.nameAutocomplete.setBounds(circle.getBounds());
  }

  render() {
    return (
      <div className="location-panel">

        <div className="location-content-wrapper">
          <input
            className={classNames(Classes.INPUT, Classes.FILL, "location-name")}
            value={this.state.location.name}
            ref={(element) => this.nameInput = element}
            placeholder="Name"
            onChange={this.onNameChange}
          />
          <Select.Creatable
            backspaceToRemoveMessage=""
            multi={true}
            options={this.getSelectOptions(this.state.allTags)}
            value={this.getSelectOptions(this.state.location.tags)}
            placeholder="Add tags"
            onChange={this.onTagsChange}
          />
          <input
            className={classNames(Classes.INPUT, Classes.FILL, "location-address")}
            value={this.state.location.address}
            placeholder="Address"
            ref={(element) => this.addressInput = element}
            onChange={this.onAddressChange}
          />
          <textarea
            className={classNames(Classes.INPUT, Classes.FILL, "location-notes")}
            value={this.state.location.notes}
            placeholder="Notes"
            onChange={this.onNotesChange}
          />
        </div>

        <div className="edit-location-panel-edit-controls">
          <Button text="Cancel" onClick={this.cancelEdit} />
          <Button text="Save" intent={Intent.SUCCESS} onClick={this.saveEdit} />
          {this.state.location.id && <Button text="Delete" intent={Intent.DANGER} onClick={this.deleteLocation} />}
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

  private onNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.updateLocation({ notes: event.target.value });
  }

  private cancelEdit = () => this.props.onCancel(this.state.location.id);
  private saveEdit = () => this.props.onSave(this.state.location, this.props.initialLocation);
  private deleteLocation = () => this.props.onDelete(this.state.location.id);

  private onTagsChange = (values: Array<Select.Option<string>>) => {
    const tags = values.map((value) => value.value);
    this.updateLocation({ tags });
  }

  private getSelectOptions = (rawStrings: string[]): Array<Select.Option<string>> => {
    return rawStrings.map((tag) => ({
      label: tag,
      value: tag,
    }));
  }
}

const mapStateToProps = (state: RootState): ConnectedProps => ({
  currentLocation: state.location.currentLocation,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>): DispatchProps => ({
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
  connect(mapStateToProps, mapDispatchToProps)(EditLocationPanel);

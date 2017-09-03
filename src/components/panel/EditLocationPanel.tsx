import { Button, Classes, Intent } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import * as Select from "react-select";

import { backendApi } from "@src/api/BackendApi";
import { Location } from "@src/api/interfaces";
import { getCurrentLocation } from "@src/api/MapsApi";
import { ClosePanel, ToggleDetailPanel, ToggleEditPanel } from "@src/store/actionPanel/actions";
import { createOrUpdateLocation, deleteLocation } from "@src/store/locations/actions";
import { RootState } from "@src/store/store";

import "./EditLocationPanel.less";

interface OwnProps {
  initialLocation?: Location;
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

class EditLocationPanel extends React.PureComponent<OwnProps & DispatchProps, State> {
  state: State = {
    location: {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      notes: "",
      tags: [],
    },
    allTags: [],
    isSaving: false,
  };

  private nameInput: HTMLInputElement;
  private addressInput: HTMLInputElement;
  private geocodeAutocomplete: any;
  private establishmentAutocomplete: any;

  componentWillMount() {
    if (this.props.initialLocation) {
      this.setState({
        location: { ...this.props.initialLocation },
      });
    }
    backendApi.getAllTags().then((allTags) => this.setState({ allTags }));
  }

  componentDidMount() {
    // hack for loading google maps dependency in-browser
    const google = (window as any).google;

    this.geocodeAutocomplete = new google.maps.places.Autocomplete(this.addressInput, {
      types: ["geocode"],
    });
    this.geocodeAutocomplete.addListener("place_changed", () => {
      // TODO: console.log(this.geocodeAutocomplete.getPlace());
    });

    this.establishmentAutocomplete = new google.maps.places.Autocomplete(this.nameInput, {
      types: ["establishment"],
    });
    this.establishmentAutocomplete.addListener("place_changed", () => {
      // TODO: console.log(this.establishmentAutocomplete.getPlace());
    });

    getCurrentLocation().then((position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const circle = new google.maps.Circle({
        center: location,
        radius: position.coords.accuracy,
      });

      this.geocodeAutocomplete.setBounds(circle.getBounds());
      this.establishmentAutocomplete.setBounds(circle.getBounds());
    });
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

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
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
  };
}

export const ConnectedEditLocationPanel: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(EditLocationPanel);

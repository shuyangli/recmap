import * as React from "react";
import { CreateLocationRequest, Location } from "../../api/interfaces";
import { ConnectedTagsMultiSelect } from "../shared/TagsMultiSelect";
import * as classNames from "classnames"
import { Classes } from "@blueprintjs/core";
import { connect } from "react-redux";
import { TypedDispatch } from "../../store/TypedDispatch";
import { getMapElement } from "../../store/locations/actions";

import "./SharedEntryStyles.less";
import "./LocationDetailEditor.less";

export interface LocationDetailEditorState {
  name?: string;
  address?: string;
  googlePlaceId?: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
}

interface OwnProps {
  editorState: LocationDetailEditorState;
  onStateUpdate: (editorState: LocationDetailEditorState) => void;
}

interface DispatchProps {
  getMapElement: () => google.maps.Map;
}

type LocationDetailEditorProps = OwnProps & DispatchProps;

export class LocationDetailEditor extends React.PureComponent<LocationDetailEditorProps, never> {
  public static convertLocationToEditorState(location?: Location): LocationDetailEditorState {
    if (location) {
      return {
        name: location.name,
        address: location.address,
        googlePlaceId: location.googlePlaceId,
        latitude: location.latitude,
        longitude: location.longitude,
        tags: location.tags,
      };
    } else {
      return { tags: [] };
    }
  }

  public static convertEditorStateToRequest(editorState: LocationDetailEditorState): CreateLocationRequest {
    if (!LocationDetailEditor.isEditorStateComplete(editorState)) {
      throw new Error("Some required fields are not set");
    }
    return {
      name: editorState.name,
      address: editorState.address,
      googlePlaceId: editorState.googlePlaceId,
      latitude: editorState.latitude,
      longitude: editorState.longitude,
      tags: editorState.tags,
      review: undefined,
    };
  }

  public static isEditorStateComplete(editorState: LocationDetailEditorState): boolean {
    return editorState.name != null && editorState.latitude != null && editorState.longitude != null;
  }

  private nameInput: HTMLInputElement;
  private nameAutocomplete: google.maps.places.Autocomplete;

  private setupNameInput() {
    this.nameAutocomplete = new google.maps.places.Autocomplete(this.nameInput, {
      types: ["establishment"],
      fields: [
        "address_component",
        "adr_address",
        "alt_id",
        "formatted_address",
        "geometry",
        "id",
        "name",
        "permanently_closed",
        "place_id",
        "scope",
        "type",
        "url",
      ],
    });
    this.nameAutocomplete.addListener("place_changed", () => {
      const place = this.nameAutocomplete.getPlace();
      const name = place.name;
      if (place.place_id) {
        this.updateLocation({
          name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          googlePlaceId: place.place_id,
        });
      } else {
        this.updateLocation({ name });
      }
    });
  }

  componentDidMount() {
    this.setupNameInput();

    // Bind autocomplete bias to map bounds
    const mapElement = this.props.getMapElement();
    this.nameAutocomplete.bindTo("bounds", mapElement);
  }

  componentWillUnmount() {
    this.nameAutocomplete.unbindAll();
  }

  render() {
    return (
      <div className="location-detail-editor">
        <div className="location-editor-entry">
          <div className="location-editor-heading">Name</div>
          <input
            className={classNames(Classes.INPUT, Classes.FILL, "location-name")}
            value={this.props.editorState.name}
            ref={(element) => this.nameInput = element}
            placeholder="Name"
            onChange={this.onNameChange}
          />
        </div>

        <div className="location-editor-entry">
          <div className="location-editor-heading">Address</div>
          <input
            className={classNames(Classes.INPUT, Classes.FILL, "location-address")}
            value={this.props.editorState.address}
            placeholder="Address"
            onChange={this.onAddressChange}
          />
        </div>

        <div className="location-editor-entry">
          <div className="location-editor-heading">Tags</div>
          <ConnectedTagsMultiSelect
            tags={this.props.editorState.tags}
            onSelect={this.onTagsChange}
          />
        </div>
      </div>
    );
  }

  private updateLocation(partial: Partial<LocationDetailEditorState>) {
    this.props.onStateUpdate({ ...this.props.editorState, ...partial });
  }

  private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.updateLocation({ name: event.target.value });
  }

  private onAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.updateLocation({ address: event.target.value });
  }

  private onTagsChange = (tags: string[]) => {
    this.updateLocation({ tags });
  }
}

const mapDispatchToProps = (dispatch: TypedDispatch): DispatchProps => ({
  getMapElement: () => dispatch(getMapElement()),
});

export const ConnectedLocationDetailEditor: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(LocationDetailEditor);

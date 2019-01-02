import { TypedAction } from "redoodle";
import { Dispatch } from "redux";

import { ApplicationApi } from "../../api/ApplicationApi";
import { Location } from "../../api/interfaces";
import { FilterState } from "./types";
import { RootState } from "../RootState";
import { getCurrentPosition } from "../../api/MapsApi";

export const UpdateAllLocations = TypedAction.define("UpdateAllLocations")<{
  locations: { [id: string]: Location };
}>();

export const AddLocation = TypedAction.define("AddLocation")<{
  location: Location;
}>();

export const RemoveLocation = TypedAction.define("RemoveLocation")<{
  locationId: string;
}>();

export const UpdateFilter = TypedAction.define("UpdateFilter")<{
  filter: FilterState;
}>();

export const SetCurrentPosition = TypedAction.define("SetCurrentPosition")<{
  position: Position;
}>();

export function loadLocations() {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.getAllLocations()
    .then((locations) => {
      dispatch(UpdateAllLocations.create({ locations }));
      return locations;
    });
}

export function createLocation(location: Location) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.createLocation(location)
    .then((loc) => {
      dispatch(AddLocation.create({ location: loc }));
      return loc;
    });
}

export function updateLocation(locationId: string, location: Location) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.updateLocation(locationId, location)
    .then((loc) => {
      dispatch(AddLocation.create({ location: loc }));
      return loc;
    });
}

export function deleteLocation(locationId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.deleteLocation(locationId)
    .then(() => dispatch(RemoveLocation.create({ locationId })));
}

export function centerMapAroundLocation(locationId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => {
    const location = getState().location.locations[locationId];
    if (location) {
      api.mapsApi.setMapCenter(location.latitude, location.longitude);
    }
  };
}

export function initializeMapElement(ref: HTMLDivElement) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => api.mapsApi.initializeMapElement(ref);
}

export function getMapElement() {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => api.mapsApi.getMapElement();
}

export function getGoogleMapsUrl(placeId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => api.mapsApi.getGoogleMapsUrl(placeId);
}

export function updateCurrentPosition() {
  return (dispatch: Dispatch) =>
    getCurrentPosition().then((position) => dispatch(SetCurrentPosition.create({ position })));
}

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
    .then((locations) => dispatch(UpdateAllLocations.create({ locations })));
}

export function createOrUpdateLocation(newLocation: Location, oldLocation?: Location) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.createOrUpdateLocation(newLocation, oldLocation)
    .then((location) => dispatch(AddLocation.create({ location })));
}

export function deleteLocation(locationId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.deleteLocation(locationId)
    .then(() => dispatch(RemoveLocation.create({ locationId })));
}

export function initializeMapElement(ref: HTMLDivElement) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => api.mapsApi.initializeMapElement(ref);
}

export function getGoogleMapsUrl(placeId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => api.mapsApi.getGoogleMapsUrl(placeId);
}

export function updateCurrentPosition() {
  return (dispatch: Dispatch) =>
    getCurrentPosition().then((position) => dispatch(SetCurrentPosition.create({ position })));
}

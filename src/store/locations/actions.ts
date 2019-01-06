import { TypedAction } from "redoodle";
import { Dispatch } from "redux";

import { ApplicationApi } from "../../api/ApplicationApi";
import { Location, CreateLocationRequest, LocationReview, PositionWithMetadata } from "../../api/interfaces";
import { FilterState } from "./types";
import { RootState } from "../RootState";
import { getCurrentPosition } from "../../api/MapsApi";
import { TypedDispatch } from "../TypedDispatch";

export const UpdateAllLocations = TypedAction.define("UpdateAllLocations")<{
  locations: { [id: string]: Location };
}>();

export const SetLocation = TypedAction.define("SetLocation")<{
  location: Location;
}>();

export const RemoveLocation = TypedAction.define("RemoveLocation")<{
  locationId: string;
}>();

export const UpdateFilter = TypedAction.define("UpdateFilter")<{
  filter: FilterState;
}>();

export const SetCurrentPosition = TypedAction.define("SetCurrentPosition")<{
  position: PositionWithMetadata;
}>();

export const SetPresetPositions = TypedAction.define("SetPresetPositions")<{
  positions: PositionWithMetadata[];
}>();

export function loadLocations() {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.getAllLocations()
    .then((locations) => {
      dispatch(UpdateAllLocations.create({ locations }));
      return locations;
    });
}

export function createLocation(request: CreateLocationRequest) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.createLocation(request)
    .then((loc) => {
      dispatch(SetLocation.create({ location: loc }));
      return loc;
    });
}

export function updateLocation(locationId: string, request: Partial<CreateLocationRequest>) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.updateLocation(locationId, request)
    .then((loc) => {
      dispatch(SetLocation.create({ location: loc }));
      return loc;
    });
}

export function deleteLocation(locationId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.deleteLocation(locationId)
    .then(() => dispatch(RemoveLocation.create({ locationId })));
}

export function setReview(locationId: string, review: LocationReview) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.setReview(locationId, review)
    .then((loc) => dispatch(SetLocation.create({ location: loc })));
}

export function deleteReview(locationId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) =>
    api.backendApi.deleteReview(locationId)
    .then((loc) => dispatch(SetLocation.create({ location: loc })));
}

export function centerMapAroundLocation(locationId: string) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => {
    const location = getState().location.locations[locationId];
    if (location) {
      api.mapsApi.setMapCenter(location.latitude, location.longitude);
    }
  };
}

export function getAllTags() {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => api.backendApi.getAllTags();
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

export function setCurrentPosition(position: PositionWithMetadata) {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => {
    dispatch(SetCurrentPosition.create({ position }));
    api.mapsApi.setMapCenter(position.position.latitude, position.position.longitude);
  };
}

export function setCurrentPositionToGeolocation() {
  return (dispatch: TypedDispatch) =>
    getCurrentPosition().then((position) => dispatch(setCurrentPosition({
      name: "Current Location",
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    })));
}

export function initializePresetPositions() {
  return (dispatch: Dispatch, getState: () => RootState, api: ApplicationApi) => {
    api.backendApi.getMapPresets().then((positions) => {
      dispatch(SetPresetPositions.create({ positions }));
    });
  };
}

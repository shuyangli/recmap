import { setWith, TypedAction, TypedReducer, omit } from "redoodle";
import { Dispatch } from "redux";

import { backendApi } from "../../api/BackendApi";
import { getCurrentLocation } from "../../api/MapsApi";
import { Location } from "../../api/interfaces";
import { FilterState, LocationState } from "./types";

const UpdateAllLocations = TypedAction.define("UpdateAllLocations")<{
  locations: { [id: string]: Location };
}>();

const AddLocation = TypedAction.define("AddLocation")<{
  location: Location;
}>();

const RemoveLocation = TypedAction.define("RemoveLocation")<{
  locationId: string;
}>();

export function loadLocations() {
  return (dispatch: Dispatch) =>
    backendApi.getAllLocations()
    .then((locations) => dispatch(UpdateAllLocations.create({ locations })));
}

export function createOrUpdateLocation(newLocation: Location, oldLocation?: Location) {
  return (dispatch: Dispatch) =>
    backendApi.createOrUpdateLocation(newLocation, oldLocation)
    .then((location) => dispatch(AddLocation.create({ location })));
}

export function deleteLocation(locationId: string) {
  return (dispatch: Dispatch) =>
    backendApi.deleteLocation(locationId)
    .then(() => dispatch(RemoveLocation.create({ locationId })));
}

export const UpdateFilter = TypedAction.define("UpdateFilter")<{
  filter: FilterState;
}>();

export const SetCurrentLocation = TypedAction.define("SetCurrentLocation")<{
  latitude: number;
  longitude: number;
}>();
export function updateCurrentLocation() {
  return (dispatch: Dispatch) =>
    getCurrentLocation().then((position) => dispatch(SetCurrentLocation.create({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })));
}

export const locationsReducer = TypedReducer.builder<LocationState>()
  .withHandler(UpdateAllLocations.TYPE, (state, { locations }) => setWith(state, { locations }))
  .withHandler(AddLocation.TYPE, (state, { location }) => setWith(state, {
    locations: setWith(state.locations, { [location.id]: location }),
  }))
  .withHandler(RemoveLocation.TYPE, (state, { locationId }) => setWith(state, {
    locations: omit(state.locations, [locationId]),
  }))
  .withHandler(UpdateFilter.TYPE, (state, { filter }) => setWith(state, { filter }))
  .withHandler(SetCurrentLocation.TYPE, (state, { latitude, longitude }) => setWith(state, {
    currentLocation: { latitude, longitude },
  }))
  .build();

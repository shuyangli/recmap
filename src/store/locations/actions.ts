import * as _ from "lodash";
import { setWith, TypedAction, TypedReducer } from "redoodle";
import { Dispatch } from "redux";

import { backendApi } from "@src/api/BackendApi";
import { getCurrentLocation } from "@src/api/MapsApi";
import { Location } from "@src/api/interfaces";
import { RootState } from "@src/store/store";
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
  return (dispatch: Dispatch<RootState>) =>
    backendApi.getAllLocations()
    .then((locations) => dispatch(UpdateAllLocations.create({ locations })));
}

export function createOrUpdateLocation(newLocation: Location, oldLocation?: Location) {
  return (dispatch: Dispatch<RootState>) =>
    backendApi.createOrUpdateLocation(newLocation, oldLocation)
    .then((location) => dispatch(AddLocation.create({ location })));
}

export function deleteLocation(locationId: string) {
  return (dispatch: Dispatch<RootState>) =>
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
  return (dispatch: Dispatch<RootState>) =>
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
    locations: _.omit(state.locations, locationId) as { [id: string]: Location },
  }))
  .withHandler(UpdateFilter.TYPE, (state, { filter }) => setWith(state, { filter }))
  .withHandler(SetCurrentLocation.TYPE, (state, { latitude, longitude }) => setWith(state, {
    currentLocation: { latitude, longitude },
  }))
  .build();

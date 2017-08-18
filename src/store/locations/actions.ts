import * as _ from "lodash";
import { TypedAction, TypedReducer } from "redoodle";
import { Dispatch } from "redux";

import { backendApi } from "@src/api/BackendApi";
import { Location } from "@src/api/interfaces";
import { RootState } from "@src/store/store";
import { EMPTY_LOCATION_STATE, FilterState, LocationState } from "./types";


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

export const locationsReducer = TypedReducer.builder<LocationState>()
  .withHandler(UpdateAllLocations.TYPE, (state, { locations }) => ({ ...state, locations }))
  .withHandler(AddLocation.TYPE, (state, { location }) => ({
    ...state,
    locations: {
      ...state.locations,
      [location.id]: location,
    },
  }))
  .withHandler(RemoveLocation.TYPE, (state, { locationId }) => ({
    ...state,
    locations: _.omit(state.locations, locationId),
  }))
  .withHandler(UpdateFilter.TYPE, (state, { filter }) => ({ ...state, filter }))
  .build();

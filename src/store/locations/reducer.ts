import { setWith, TypedReducer, omit } from "redoodle";
import * as actions from "./actions";
import { LocationState } from "./types";

export const locationsReducer = TypedReducer.builder<LocationState>()
  .withHandler(actions.UpdateAllLocations.TYPE, (state, { locations }) => setWith(state, { locations }))
  .withHandler(actions.SetLocation.TYPE, (state, { location }) => setWith(state, {
    locations: setWith(state.locations, { [location.id]: location }),
  }))
  .withHandler(actions.RemoveLocation.TYPE, (state, { locationId }) => setWith(state, {
    locations: omit(state.locations, [locationId]),
  }))
  .withHandler(actions.UpdateFilter.TYPE, (state, { filter }) => setWith(state, { filter }))
  .withHandler(actions.SetCurrentPosition.TYPE, (state, { position }) => setWith(state, { currentPosition: position }))
  .withHandler(actions.SetPresetPositions.TYPE, (state, { positions }) =>setWith(state, {
    presetPositions: positions,
  }))
  .build();

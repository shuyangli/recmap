import * as _ from "lodash";

import { Location } from "@src/api/interfaces";
import { ADD_LOCATION, REMOVE_LOCATION, UPDATE_ALL_LOCATIONS, UPDATE_FILTER } from "./actions";
import { EMPTY_LOCATION_STATE, FilterState, LocationState } from "./types";

export function locationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any): LocationState {
  switch (action.type) {
    case UPDATE_ALL_LOCATIONS:
      return { ...state, locations: action.payload.locations };

    case ADD_LOCATION:
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.payload.location.id]: action.payload.location,
        },
      };

    case REMOVE_LOCATION:
      return {
        ...state,
        locations: _.omit(state.locations, action.payload.locationId),
      };

    case UPDATE_FILTER:
      return {
        ...state,
        filter: action.payload.filter,
      };

    default:
      return state;
  }
}

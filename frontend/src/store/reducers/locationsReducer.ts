import { Location } from '../../api/interfaces';
import { LOAD_LOCATIONS_FINISHED, SAVE_LOCATION_FINISHED } from '../actions';

export interface LocationState {
  locations: { [id: string]: Location };
}

const EMPTY_LOCATION_STATE: LocationState = {
  locations: {},
};

export function locationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any): LocationState {
  switch (action.type) {
    case LOAD_LOCATIONS_FINISHED:
      return Object.assign({}, state, { locations: action.payload.locations });

    case SAVE_LOCATION_FINISHED:
      // Directly manipulate the locations in place
      const newLocation: Location = action.payload.location;
      const locations = Object.assign({}, state.locations, {
        [newLocation.id]: newLocation
      });
      return Object.assign({}, state, { locations });

    default:
      return state;
  }
}

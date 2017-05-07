import { Location } from '../../api/interfaces';
import {
  LOAD_LOCATIONS_STARTED,
  LOAD_LOCATIONS_FINISHED,
  SAVE_LOCATION_STARTED,
  SAVE_LOCATION_FINISHED
} from '../actions';

export interface LocationState {
  locations: { [id: string]: Location };
  isLoading: boolean;
  isSaving: boolean;
}

const EMPTY_LOCATION_STATE: LocationState = {
  locations: {},
  isLoading: false,
  isSaving: false
};

export function locationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any) {
  switch (action.type) {
    case LOAD_LOCATIONS_STARTED:
      return Object.assign({}, state, {
        isLoading: true
      }  as LocationState);

    case LOAD_LOCATIONS_FINISHED:
      return Object.assign({}, state, {
        locations: action.payload.locations,
        isLoading: false
      }  as LocationState);

    case SAVE_LOCATION_STARTED:
      return Object.assign({}, state, {
        isSaving: true
      } as LocationState);

    case SAVE_LOCATION_FINISHED:
      // Directly manipulate the locations in place
      const newLocation: Location = action.payload.location;
      const allLocations = Object.assign({}, state.locations);
      allLocations[newLocation.id] = newLocation;

      return Object.assign({}, state, {
        locations: allLocations,
        isSaving: false
      } as LocationState);

    default:
      return state;
  }
}

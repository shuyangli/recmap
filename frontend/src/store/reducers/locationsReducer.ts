import { Location } from '../../api/interfaces';
import { LOAD_LOCATIONS_STARTED, LOAD_LOCATIONS_FINISHED } from '../actions';

export interface LocationState {
  locations: {[id: string]: Location};
  isLoading: boolean;
}

const EMPTY_LOCATION_STATE: LocationState = {
  locations: {},
  isLoading: false
};

export function locationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any) {
  switch (action.type) {
    case LOAD_LOCATIONS_STARTED:
      return Object.assign({}, state, {
        isLoading: true
      });
    case LOAD_LOCATIONS_FINISHED:
      return Object.assign({}, state, {
        locations: action.locations,
        isLoading: false
      });
    default:
      return state;
  }
}

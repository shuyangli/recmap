import * as _ from 'lodash';
import { Location } from '@src/api/interfaces';
import { UPDATE_ALL_LOCATIONS, ADD_LOCATION, REMOVE_LOCATION, UPDATE_FILTER } from './actions';
import { LocationState, FilterState, EMPTY_LOCATION_STATE } from './types';

export function locationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any): LocationState {
  switch (action.type) {
    case UPDATE_ALL_LOCATIONS:
      return { ...state, locations: action.payload.locations };

    case ADD_LOCATION:
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.payload.location.id]: action.payload.location
        }
      };

    case REMOVE_LOCATION:
      return {
        ...state,
        locations: _.omit(state.locations, action.payload.locationId)
      };

    case UPDATE_FILTER:
      return {
        ...state,
        filter: action.payload.filter
      };

    default:
      return state;
  }
}

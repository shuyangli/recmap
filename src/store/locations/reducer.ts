import * as _ from 'lodash';
import { Location } from '../../api/interfaces';
import { UPDATE_ALL_LOCATIONS, ADD_LOCATION, REMOVE_LOCATION, UPDATE_FILTER } from './actions';
import { LocationState, FilterState, EMPTY_LOCATION_STATE } from './types';

export function locationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any): LocationState {
  switch (action.type) {
    case UPDATE_ALL_LOCATIONS:
      return Object.assign({}, state, { locations: action.payload.locations });

    case ADD_LOCATION:
      // Directly manipulate the locations in place
      const newLocation: Location = action.payload.location;
      const locations = Object.assign({}, state.locations, {
        [newLocation.id]: newLocation
      });
      return Object.assign({}, state, { locations });

    case REMOVE_LOCATION:
      return Object.assign({}, state, {
        locations: _.omit(state.locations, action.payload.locationId)
      });

    case UPDATE_FILTER:
      return Object.assign({}, state, {
        filter: action.payload.filter
      });

    default:
      return state;
  }
}

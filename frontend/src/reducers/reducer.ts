import { combineReducers, applyMiddleware } from 'redux';

import { Location } from '../api/interfaces';
import { LOAD_LOCATIONS_FINISHED } from './actionTypes';

export interface LocationState {
  locations: Location[];
  isLoadingActions: boolean;
}

const EMPTY_LOCATION_STATE: LocationState = {
  locations: [],
  isLoadingActions: false
};

function loadLocationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any) {
  switch (action.type) {
    case LOAD_LOCATIONS_FINISHED:
      return Object.assign({}, state, {
        locations: action.payload.locations
      });
    default:
      return state;
  }
}

export const reducer = combineReducers({
  location: loadLocationsReducer
});
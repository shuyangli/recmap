import { combineReducers, applyMiddleware } from 'redux';

import { Location } from '../api/interfaces';
import { LOAD_LOCATIONS } from './actionTypes';

export interface LocationState {
  locations: Location[];
}

const EMPTY_LOCATION_STATE: LocationState = {
  locations: []
};

function loadLocationsReducer(state: LocationState = EMPTY_LOCATION_STATE, action: any) {
  switch (action.type) {
    case LOAD_LOCATIONS:
      return Object.assign({}, state, {
        locations: [{
          id: 'test',
          name: 'test',
          address: 'test',
          latitude: 'test',
          longitude: 'test',
          notes: 'test'
        }]
      });
    default:
      return state;
  }
}

export const reducer = combineReducers({
  location: loadLocationsReducer
});
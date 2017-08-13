import { Dispatch } from 'redux';
import { RootState } from '@src/store/store';
import { backendApi } from '@src/api/BackendApi';
import { Location } from '@src/api/interfaces';
import { FilterState } from './types';

export const UPDATE_ALL_LOCATIONS = 'UPDATE_ALL_LOCATIONS';
export const updateAllLocations = (locations: { [id: string]: Location }) => ({
 type: UPDATE_ALL_LOCATIONS,
  payload: { locations }
});

export const ADD_LOCATION = 'ADD_LOCATION';
export const addLocation = (location: Location) => ({
  type: ADD_LOCATION,
  payload: { location }
});

export const REMOVE_LOCATION = 'REMOVE_LOCATION';
export const removeLocation = (locationId: string) => ({
  type: REMOVE_LOCATION,
  payload: { locationId }
});

export function loadLocations() {
  return (dispatch: Dispatch<RootState>) =>
    backendApi.getAllLocations()
    .then(locations => dispatch(updateAllLocations(locations)));
}

export function createOrUpdateLocation(newLocation: Location, oldLocation?: Location) {
  return (dispatch: Dispatch<RootState>) =>
    backendApi.createOrUpdateLocation(newLocation, oldLocation)
    .then(location => dispatch(addLocation(location)));
}

export function deleteLocation(locationId: string) {
  return (dispatch: Dispatch<RootState>) =>
    backendApi.deleteLocation(locationId)
    .then(() => dispatch(removeLocation(locationId)));
}

export const UPDATE_FILTER = 'UPDATE_FILTER';
export const updateFilter = (filter: FilterState) => ({
  type: UPDATE_FILTER,
  payload: { filter }
});

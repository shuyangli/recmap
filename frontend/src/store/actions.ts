import { Dispatch } from 'redux';
import { RootState } from './store';
import { backendApi } from '../api/BackendApi';
import { Location } from '../api/interfaces';

export const LOAD_LOCATIONS_STARTED = '//LOAD_LOCATIONS_STARTED';
export const LOAD_LOCATIONS_FINISHED = '//LOAD_LOCATIONS_FINISHED';
export const SAVE_LOCATION_STARTED = '//SAVE_LOCATION_STARTED';
export const SAVE_LOCATION_FINISHED = '//SAVE_LOCATION_FINISHED';

export function loadLocations() {
  return (dispatch: Dispatch<RootState>) => {
    dispatch({
      type: LOAD_LOCATIONS_STARTED
    });

    return backendApi.getAllLocations()
      .then(locations => dispatch({
        type: LOAD_LOCATIONS_FINISHED,
        payload: { locations }
      }));
  };
}

export function createOrUpdateLocation(location: Location) {
  return (dispatch: Dispatch<RootState>) => {
    dispatch({
      type: SAVE_LOCATION_STARTED
    });

    return backendApi.createOrUpdateLocation(location)
      .then(location => dispatch({
        type: SAVE_LOCATION_FINISHED,
        payload: { location }
      }));
  }
}

export const TOGGLE_DETAIL_PANEL = '//TOGGLE_DETAIL_PANEL';
export const TOGGLE_EDIT_PANEL = '//TOGGLE_EDIT_PANEL';
export const CLOSE_PANEL = '//CLOSE_PANEL';

export function toggleDetailsPanel(locationId: string) {
  return {
    type: TOGGLE_DETAIL_PANEL,
    payload: { locationId }
  };
}

export function toggleEditPanel(locationId?: string) {
  return {
    type: TOGGLE_EDIT_PANEL,
    payload: { locationId }
  };
}

export function closePanel() {
  return {
    type: CLOSE_PANEL
  };
}

import { backendApi } from '../api/BackendApi';

export const LOAD_LOCATIONS_STARTED = '//LOAD_LOCATIONS_STARTED';
export const LOAD_LOCATIONS_FINISHED = '//LOAD_LOCATIONS_FINISHED';

export function loadLocations() {
  return (dispatch: any) => {
    dispatch({
      type: LOAD_LOCATIONS_STARTED
    });

    return backendApi.getAllLocations()
      .then(locations => dispatch({
        type: LOAD_LOCATIONS_FINISHED,
        locations
      }));
  };
}

export const OPEN_PANEL = '//OPEN_PANEL';
export const CLOSE_PANEL = '//CLOSE_PANEL';

export function openAddPanel() {
  return {
    type: OPEN_PANEL
  };
}

export function openEditPanel(locationId: string) {
  return {
    type: OPEN_PANEL,
    locationId
  };
}

export function closePanel() {
  return {
    type: CLOSE_PANEL
  };
}

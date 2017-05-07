import { backendApi } from '../api/BackendApi';

export const LOAD_LOCATIONS_FINISHED = '//LOAD_LOCATIONS_FINISHED';

export function loadLocations() {
  return (dispatch: any) => {
    return backendApi.getAllLocations()
      .then(locations => dispatch({
        type: LOAD_LOCATIONS_FINISHED,
        payload: { locations }
      }));
  };
}

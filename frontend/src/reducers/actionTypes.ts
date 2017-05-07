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
        payload: { locations }
      }));
  };
}

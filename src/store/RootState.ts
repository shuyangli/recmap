import { EMPTY_ACTION_PANEL_STATE, ActionPanelState } from "./actionPanel/types";
import { EMPTY_LOCATION_STATE, LocationState } from "./locations/types";

export interface RootState {
  location: LocationState;
  actionPanel: ActionPanelState;
}

export const initialState: RootState = {
  location: EMPTY_LOCATION_STATE,
  actionPanel: EMPTY_ACTION_PANEL_STATE,
};

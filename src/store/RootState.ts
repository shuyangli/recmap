import { EMPTY_ACTION_PANEL_STATE, ActionPanelState } from "./actionPanel/types";
import { EMPTY_LOCATION_STATE, LocationState } from "./locations/types";
import { EMPTY_USER_STATE, UserState } from "./user/types";

export interface RootState {
  location: LocationState;
  actionPanel: ActionPanelState;
  user: UserState;
}

export const initialState: RootState = {
  location: EMPTY_LOCATION_STATE,
  actionPanel: EMPTY_ACTION_PANEL_STATE,
  user: EMPTY_USER_STATE,
};

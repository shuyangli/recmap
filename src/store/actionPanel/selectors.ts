import { RootState } from "../RootState";

export const getCurrentLocationId = (state: RootState) => state.actionPanel.locationId;
export const getActiveLocationId = (state: RootState) =>
  state.actionPanel.isVisible ? state.actionPanel.locationId : undefined;

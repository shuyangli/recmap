import { TypedAction, TypedReducer } from "redoodle";
import { ActionPanelState, ActionPanelType } from "./types";

export const ToggleDetailPanel = TypedAction.define("ToggleDetailPanel")<{
  locationId: string;
}>();
export const ToggleEditPanel = TypedAction.define("ToggleEditPanel")<{
  locationId?: string;
}>();
export const ClosePanel = TypedAction.defineWithoutPayload("ClosePanel")();

export const actionPanelReducer = TypedReducer.builder<ActionPanelState>()
  .withHandler(ToggleDetailPanel.TYPE, (state, { locationId }) => ({
    ...state,
    locationId,
    isVisible: state.type === ActionPanelType.DETAIL && locationId === state.locationId
      ? !state.isVisible
      : true,
    type: ActionPanelType.DETAIL,
  }))
  .withHandler(ToggleEditPanel.TYPE, (state, { locationId }) => ({
    ...state,
    locationId,
    isVisible: state.type === ActionPanelType.EDIT && locationId === state.locationId
      ? !state.isVisible
      : true,
    type: ActionPanelType.EDIT,
  }))
  .withHandler(ClosePanel.TYPE, (state) => ({ ...state, isVisible: false }))
  .build();

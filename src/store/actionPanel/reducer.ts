import { setWith, TypedReducer } from "redoodle";
import { ActionPanelState, ActionPanelType } from "./types";
import * as actions from "./actions";

export const actionPanelReducer = TypedReducer.builder<ActionPanelState>()
  .withHandler(actions.ToggleDetailPanel.TYPE, (state, { locationId }) => setWith(state, {
    locationId,
    isVisible: state.type === ActionPanelType.DETAIL && locationId === state.locationId
      ? !state.isVisible
      : true,
    type: ActionPanelType.DETAIL,
  }))
  .withHandler(actions.ToggleEditPanel.TYPE, (state, { locationId }) => setWith(state, {
    locationId,
    isVisible: state.type === ActionPanelType.EDIT && locationId === state.locationId
      ? !state.isVisible
      : true,
    type: ActionPanelType.EDIT,
  }))
  .withHandler(actions.ClosePanel.TYPE, (state) => setWith(state, { isVisible: false }))
  .build();

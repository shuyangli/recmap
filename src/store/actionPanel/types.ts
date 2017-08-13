export enum ActionPanelType {
  DETAIL,
  EDIT,
}

export interface ActionPanelState {
  locationId?: string;
  isVisible: boolean;
  type: ActionPanelType;
}

export const EMPTY_ACTION_PANEL_STATE: ActionPanelState = {
  isVisible: false,
  type: ActionPanelType.DETAIL,
};

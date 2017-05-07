import { TOGGLE_DETAIL_PANEL, TOGGLE_EDIT_PANEL, CLOSE_PANEL } from '../actions';

export enum ActionPanelType {
  DETAIL,
  EDIT
}

export interface ActionPanelState {
  locationId?: string;
  isVisible: boolean;
  type: ActionPanelType;
}

const EMPTY_STATE: ActionPanelState = {
  isVisible: false,
  type: ActionPanelType.DETAIL
};

export function actionPanelReducer(state: ActionPanelState = EMPTY_STATE, action: any) {
  switch (action.type) {
    case TOGGLE_DETAIL_PANEL:
      return Object.assign({}, state, {
        locationId: action.payload.locationId,
        isVisible: state.type !== ActionPanelType.DETAIL
                    ? true
                    : (action.payload.locationId === state.locationId) ? !state.isVisible : true,
        type: ActionPanelType.DETAIL
      } as ActionPanelState);

    case TOGGLE_EDIT_PANEL:
      return Object.assign({}, state, {
        locationId: action.payload.locationId,
        isVisible: state.type !== ActionPanelType.EDIT
                    ? true
                    : (action.payload.locationId === state.locationId) ? !state.isVisible : true,
        type: ActionPanelType.EDIT
      } as ActionPanelState);

    case CLOSE_PANEL:
      return Object.assign({}, state, {
        isVisible: false
      } as ActionPanelState);

    default:
      return state;
  }
}

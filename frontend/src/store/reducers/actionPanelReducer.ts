import { OPEN_PANEL, CLOSE_PANEL } from '../actions';

export interface ActionPanelState {
  locationId?: string;
  isVisible: boolean;
}

const EMPTY_STATE: ActionPanelState = {
  isVisible: false
};

export function actionPanelReducer(state: ActionPanelState = EMPTY_STATE, action: any) {
  switch (action.type) {
    case OPEN_PANEL:
      return Object.assign({}, state, {
        locationId: action.locationId,
        isVisible: true
      } as ActionPanelState);
    case CLOSE_PANEL:
      return Object.assign({}, state, {
        isVisible: false
      } as ActionPanelState);
    default:
      return state;
  }
}

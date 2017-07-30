import { TOGGLE_DETAIL_PANEL, TOGGLE_EDIT_PANEL, CLOSE_PANEL } from './actions';
import { ActionPanelState, ActionPanelType, EMPTY_ACTION_PANEL_STATE } from './types';

export function actionPanelReducer(state: ActionPanelState = EMPTY_ACTION_PANEL_STATE, action: any): ActionPanelState {
  switch (action.type) {
    case TOGGLE_DETAIL_PANEL:
      return Object.assign({}, state, {
        locationId: action.payload.locationId,
        isVisible: state.type === ActionPanelType.DETAIL && action.payload.locationId === state.locationId
                    ? !state.isVisible
                    : true,
        type: ActionPanelType.DETAIL
      });

    case TOGGLE_EDIT_PANEL:
      return Object.assign({}, state, {
        locationId: action.payload.locationId,
        isVisible: state.type === ActionPanelType.EDIT && action.payload.locationId === state.locationId
                    ? !state.isVisible
                    : true,
        type: ActionPanelType.EDIT
      });

    case CLOSE_PANEL:
      return Object.assign({}, state, {
        isVisible: false
      });

    default:
      return state;
  }
}

import { combineReducers, applyMiddleware } from 'redux';

const INITIAL_STATE = {
}

function defaultReducer(state = INITIAL_STATE, action: any) {
  return state;
}
export default combineReducers({
  defaultReducer
});
import { RootState } from "../../store/RootState";

export function isAdminSelector(state: RootState): boolean {
  return state.user.isAdmin;
}

export function authorsSelector(state: RootState) {
  return state.user.authors;
}

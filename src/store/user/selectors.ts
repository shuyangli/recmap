import { RootState } from "../../store/RootState";

export function canEdit(state: RootState): boolean {
  return state.user.isAdmin;
}

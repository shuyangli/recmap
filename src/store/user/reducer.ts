import { TypedReducer, setWith } from "redoodle";
import * as actions from "./actions";
import { UserState } from "./types";

export const userReducer = TypedReducer.builder<UserState>()
  .withHandler(actions.UpdateCurrentUser.TYPE, (state, { currentUser }) => setWith(state, { currentUser }))
  .withHandler(actions.SetIsAdmin.TYPE, (state, { isAdmin }) => setWith(state, { isAdmin }))
  .build();

import * as firebase from "firebase";

export interface UserState {
  currentUser: firebase.User | undefined;
  isAdmin: boolean;
}

export const EMPTY_USER_STATE: UserState = {
  currentUser: undefined,
  isAdmin: false,
};

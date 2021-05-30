import firebase from "firebase/app";
import { UserRecord } from "../../api/interfaces";

export interface UserState {
  currentUser: firebase.User | undefined;
  authors: {
    [uid: string]: UserRecord;
  };
  isAdmin: boolean;
}

export const EMPTY_USER_STATE: UserState = {
  currentUser: undefined,
  authors: {},
  isAdmin: false,
};

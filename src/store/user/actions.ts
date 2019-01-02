import * as firebase from "firebase";
import { TypedAction } from "redoodle";
import { AppToaster } from "../../util/AppToaster";

export const UpdateCurrentUser = TypedAction.define("UpdateCurrentUser")<{
  currentUser: firebase.User;
}>();

export function signIn() {
  const authProvider = new firebase.auth.GoogleAuthProvider();
  return Promise.resolve(firebase.auth().signInWithPopup(authProvider)).catch((e) => {
    AppToaster.show({
      message: "Error signing in",
      intent: "danger",
    });
  });
}

export function signOut() {
  return Promise.resolve(firebase.auth().signOut()).catch((e) => {
    AppToaster.show({
      message: "Error signing out",
      intent: "danger",
    });
  });
}

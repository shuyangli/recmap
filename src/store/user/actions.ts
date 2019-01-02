import * as firebase from "firebase";
import { TypedAction } from "redoodle";
import { AppToaster } from "../../util/AppToaster";
import { TypedDispatch } from "../TypedDispatch";
import { RootState } from "../RootState";
import { ApplicationApi } from "../../api/ApplicationApi";

export const UpdateCurrentUser = TypedAction.define("UpdateCurrentUser")<{
  currentUser: firebase.User;
}>();

export const SetIsAdmin = TypedAction.define("SetIsAdmin")<{
  isAdmin: boolean;
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

export function updateCurrentUserAdminStatus()  {
  return (dispatch: TypedDispatch, getState: () => RootState, api: ApplicationApi) => {
    api.backendApi.isAdmin().then((isAdmin) => {
      dispatch(SetIsAdmin.create({ isAdmin }));
    });
  };
}

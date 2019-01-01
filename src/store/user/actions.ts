import * as firebase from "firebase";
import { TypedAction } from "redoodle";
import { TypedDispatch } from "../TypedDispatch";
import { AppToaster } from "../../util/AppToaster";

export const UpdateCurrentUser = TypedAction.define("UpdateCurrentUser")<{
  currentUser: firebase.User;
}>();

export const authenticate = () =>
  (dispatch: TypedDispatch) => {
    const authProvider = new firebase.auth.GoogleAuthProvider();
    return Promise.resolve(firebase.auth().signInWithPopup(authProvider)).then((result) => {
      dispatch(UpdateCurrentUser.create({ currentUser: result.user }));
    }).catch((e) => {
      AppToaster.show({
        message: "Error signing in",
        intent: "danger",
      });
    });
  };

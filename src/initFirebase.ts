import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { FirebaseConfig } from "./config";
import { Store } from "redux";
import { RootState } from "./store/RootState";
import { UpdateCurrentUser, SetIsAdmin, updateCurrentUserAdminStatus } from "./store/user/actions";
import { CompoundAction } from "redoodle";
import { TypedDispatch } from "./store/TypedDispatch";

export function initFirebase(config: FirebaseConfig) {
  firebase.initializeApp(config);
}

export function setupFirebaseObservers(store: Store<RootState>) {
  firebase.auth().onAuthStateChanged((maybeCurrentUser: firebase.User | null) => {
    store.dispatch(CompoundAction.create([
      SetIsAdmin.create({ isAdmin: false }),
      UpdateCurrentUser.create({ currentUser: maybeCurrentUser }),
    ]));

    if (maybeCurrentUser != null) {
      (store.dispatch as TypedDispatch)(updateCurrentUserAdminStatus());
    }
  });
}

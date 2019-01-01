import * as firebase from "firebase";
import { FirebaseConfig } from "./config";
import { Store } from "redux";
import { RootState } from "./store/RootState";
import { UpdateCurrentUser } from "./store/user/actions";

export function initFirebase(config: FirebaseConfig) {
  firebase.initializeApp(config);
}

export function setupFirebaseObservers(store: Store<RootState>) {
  firebase.auth().onAuthStateChanged((maybeCurrentUser: firebase.User | null) => {
    store.dispatch(UpdateCurrentUser.create({ currentUser: maybeCurrentUser }));
  });
}

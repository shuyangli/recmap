import * as _ from 'lodash';
import * as firebase from 'firebase';

import { Location } from './interfaces';
import { BackendApi } from './BackendApi';
import { FirebaseConfig } from '../config';

export class FirebaseApi implements BackendApi {
  constructor(config: FirebaseConfig) {
    firebase.initializeApp(config);
  };

  private getLocationKey(locationId: string) {
    return `/locations/${locationId}`;
  }

  // Need to wrap firebase.Promise<T> in a Promise.resolve because their types are not compatible
  createLocation(location: Location) {
    debugger;
    const newLocationRef = firebase.database().ref().child('locations').push();
    const newLocation = _.defaults({ id: newLocationRef.key }, location);
    return Promise.resolve(newLocationRef.set(newLocation))
    .then(() => newLocation);
  };

  updateLocation(location: Location) {
    const newLocation = _.clone(location);
    return Promise.resolve(firebase.database().ref(this.getLocationKey(newLocation.id)).set(newLocation))
    .then(() => newLocation);
  }

  getLocation(id: string) {
    return Promise.resolve(firebase.database().ref(this.getLocationKey(id)).once('value'))
    .then((snapshot) => snapshot.val());
  }

  getAllLocations() {
    return Promise.resolve(firebase.database().ref('/locations/').once('value'))
    .then((snapshot) => snapshot.val());
  }
}
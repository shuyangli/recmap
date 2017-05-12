import * as _ from 'lodash';
import * as firebase from 'firebase';

import { ObjectTranslator } from './ObjectTranslator';
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

  createOrUpdateLocation(location: Location) {
    if (location.id) {
      return this.updateLocation(location);
    } else {
      return this.createLocation(location);
    }
  }

  private createLocation(location: Location) {
    const newLocationRef = firebase.database().ref().child('locations').push();
    const newLocation = this.firebaseifyLocation(_.defaults({ id: newLocationRef.key }, location));
    return Promise.resolve(newLocationRef.set(newLocation))
    .then(() => this.appifyLocation(newLocation));
  };

  private updateLocation(location: Location) {
    const newLocation = this.firebaseifyLocation(_.clone(location));
    return Promise.resolve(firebase.database().ref(this.getLocationKey(newLocation.id)).set(newLocation))
    .then(() => this.appifyLocation(newLocation));
  }

  getLocation(id: string) {
    return Promise.resolve(firebase.database().ref(this.getLocationKey(id)).once('value'))
    .then((snapshot) => this.appifyLocation(snapshot.val()));
  }

  getAllLocations() {
    return Promise.resolve(firebase.database().ref('/locations/').once('value'))
    .then((snapshot) => _.mapValues(snapshot.val(), this.appifyLocation));
  }

  private firebaseifyLocation(appLocation: Location): any {
    return new ObjectTranslator(appLocation)
      .arrayToObject('tags')
      .get();
  }

  private appifyLocation(firebaseLocation: any): Location {
    return new ObjectTranslator(firebaseLocation)
      .objectToArray('tags')
      .get();
  }
}

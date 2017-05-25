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

  createOrUpdateLocation(newLocation: Location, oldLocation?: Location) {
    if (newLocation.id) {
      return this.updateLocation(newLocation, oldLocation);
    } else {
      return this.createLocation(newLocation);
    }
  }

  getLocation(id: string) {
    return Promise.resolve(firebase.database().ref(this.getLocationKey(id)).once('value'))
    .then((snapshot) => this.appifyLocation(snapshot.val()));
  }

  getAllLocations() {
    return Promise.resolve(firebase.database().ref('/locations/').once('value'))
    .then((snapshot) => _.mapValues(snapshot.val(), this.appifyLocation));
  }

  getAllTags() {
    return Promise.resolve(firebase.database().ref('/tags/').once('value'))
    .then((snapshot) => snapshot.val());
  }

  private getLocationKey(locationId: string) {
    return `/locations/${locationId}`;
  }

  private getTagKey(tag: string) {
    return `/tags/${tag}`;
  }

  private createLocation(location: Location) {
    const newLocationRef = firebase.database().ref().child('locations').push();
    const newLocation = this.firebaseifyLocation(_.defaults({ id: newLocationRef.key }, location));
    this.addLocationToTags(location.tags, newLocation.id);
    return Promise.resolve(newLocationRef.set(newLocation))
    .then(() => this.appifyLocation(newLocation));
  };

  private updateLocation(newLocation: Location, oldLocation: Location) {
    const location = this.firebaseifyLocation(_.clone(newLocation));
    this.removeLocationFromTags(oldLocation.tags, newLocation.id);
    this.addLocationToTags(newLocation.tags, newLocation.id);
    return Promise.resolve(firebase.database().ref(this.getLocationKey(location.id)).set(location))
    .then(() => this.appifyLocation(location));
  }

  private setLocationValueInTags = (value: boolean | null) => (tags: string[], locationId: string) => {
    tags.forEach((tag) => {
      let updateValue: { [locationId: string]: boolean } = {};
      updateValue[locationId] = value;
      firebase.database().ref(this.getTagKey(tag)).update(updateValue);
    });
  }

  private addLocationToTags = this.setLocationValueInTags(true);
  private removeLocationFromTags = this.setLocationValueInTags(null);

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

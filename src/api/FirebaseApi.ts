import * as firebase from "firebase";

import { FirebaseConfig } from "../config";
import { BackendApi } from "./BackendApi";
import { Location } from "./interfaces";
import { ObjectTranslator } from "./ObjectTranslator";
import { mapValues, defaults, clone } from "lodash-es";

export class FirebaseApi implements BackendApi {
  constructor(config: FirebaseConfig) {
    firebase.initializeApp(config);
  }

  createOrUpdateLocation(newLocation: Location, oldLocation?: Location) {
    if (newLocation.id) {
      return this.updateLocation(newLocation, oldLocation);
    } else {
      return this.createLocation(newLocation);
    }
  }

  deleteLocation(id: string) {
    return Promise.resolve(firebase.database().ref(this.getLocationKey(id)).remove());
  }

  getLocation(id: string) {
    return Promise.resolve(firebase.database().ref(this.getLocationKey(id)).once("value"))
    .then((snapshot) => this.appifyLocation(snapshot.val()));
  }

  getAllLocations() {
    return Promise.resolve(firebase.database().ref("/locations/").once("value"))
    .then((snapshot) => mapValues(snapshot.val(), this.appifyLocation));
  }

  getAllTags() {
    return Promise.resolve(firebase.database().ref("/tags/").once("value"))
    .then((snapshot) => {
      const values = snapshot.val();
      return values ? Object.keys(values) : [];
    });
  }

  private getLocationKey(locationId: string) {
    return `/locations/${locationId}`;
  }

  private getTagKey(tag: string) {
    return `/tags/${tag}`;
  }

  private createLocation(location: Location) {
    const newLocationRef = firebase.database().ref().child("locations").push();
    const newLocation = this.firebaseifyLocation(defaults({ id: newLocationRef.key }, location));
    this.addLocationToTags(location.tags, newLocation.id);
    return Promise.resolve(newLocationRef.set(newLocation))
    .then(() => this.appifyLocation(newLocation));
  }

  private updateLocation(newLocation: Location, oldLocation: Location) {
    const location = this.firebaseifyLocation(clone(newLocation));
    this.removeLocationFromTags(oldLocation.tags, newLocation.id);
    this.addLocationToTags(newLocation.tags, newLocation.id);
    return Promise.resolve(firebase.database().ref(this.getLocationKey(location.id)).set(location))
    .then(() => this.appifyLocation(location));
  }

  private setLocationValueInTags = (value: boolean | null) => (tags: string[], locationId: string) => {
    tags.forEach((tag) => {
      const updateValue: { [locationId: string]: boolean } = {};
      updateValue[locationId] = value;
      firebase.database().ref(this.getTagKey(tag)).update(updateValue);
    });
  }

  // tslint:disable-next-line:member-ordering
  private addLocationToTags = this.setLocationValueInTags(true);

  // tslint:disable-next-line:member-ordering
  private removeLocationFromTags = this.setLocationValueInTags(null);

  private firebaseifyLocation(appLocation: Location): any {
    return new ObjectTranslator(appLocation)
      .arrayToObject("tags")
      .get();
  }

  private appifyLocation(firebaseLocation: any): Location {
    return new ObjectTranslator(firebaseLocation)
      .objectToArray("tags")
      .get();
  }
}

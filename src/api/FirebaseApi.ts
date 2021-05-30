import firebase from "firebase/app";

import { mapValues, isEmpty, map, mean, forEach, filter, keys, values } from "lodash-es";
import {
  CreateLocationRequest,
  DrinkPrice,
  FoodPrice,
  Location,
  LocationReview,
  PersistedLocation,
  PositionWithMetadata,
  UserRecord,
  UserRoles,
} from "./interfaces";
import { BackendApi } from "./BackendApi";
import { ObjectTranslator } from "./ObjectTranslator";

const ADMIN_AUTH_ROLE = "admin";

function getLocationKey(locationId: string) {
  return `/locations/${locationId}`;
}

function getTagKey(tag: string) {
  return `/tags/${tag}`;
}

const setLocationValueInTags = (value: boolean | null) => (tags: string[], locationId: string) => {
  tags.forEach((tag) => {
    const updateValue: { [locationId: string]: boolean } = {};
    updateValue[locationId] = value;
    firebase.database().ref(getTagKey(tag)).update(updateValue);
  });
}
const addLocationToTags = setLocationValueInTags(true);
const removeLocationFromTags = setLocationValueInTags(null);

function firebaseifyLocation(location: PersistedLocation): any {
  return new ObjectTranslator(location)
    .arrayToObject("tags")
    .get();
}

function roundToClosestEnum<T>(input: number, options: T[]): T {
  // assuming options is a sorted array
  const differences = options.map((opt) => Math.abs((opt as any as number) - input));

  let smallestDiff = differences[0];
  let smallestIdx = 0;
  forEach(differences, (diff, idx) => {
    if (diff > smallestDiff) {
      return false;
    }
    smallestDiff = diff;
    smallestIdx = idx;
  });

  return options[smallestIdx];
}

function appifyLocation(firebaseLocation: any): Location {
  const persistedLocation: Location = new ObjectTranslator(firebaseLocation)
    .objectToArray("tags")
    .ensureObjectPresence("reviews")
    .get();

  if (!isEmpty(persistedLocation.reviews)) {
    const meanRating = mean(map(persistedLocation.reviews, review => review.rating));
    // Round -0.50 to -1
    const roundedRating = meanRating < 0 ? Math.round(meanRating - 0.001) : Math.round(meanRating);
    persistedLocation.computedRating = roundedRating;

    const allFoodPricesRatings = filter(map(persistedLocation.reviews, review => review.foodPrice), p => p != null);
    if (allFoodPricesRatings.length === 1) {
      persistedLocation.computedFoodPrice = allFoodPricesRatings[0];
    } else if (allFoodPricesRatings.length > 1) {
      persistedLocation.computedFoodPrice = roundToClosestEnum(mean(allFoodPricesRatings), [
        FoodPrice.ZERO_TO_FIFTEEN, FoodPrice.FIFTEEN_TO_THIRTY, FoodPrice.THIRTY_TO_SIXTY, FoodPrice.OVER_SIXTY,
      ]);
    }

    const allDrinksPricesRatings = filter(map(persistedLocation.reviews, review => review.drinkPrice), p => p != null);
    if (allDrinksPricesRatings.length === 1) {
      persistedLocation.computedDrinkPrice = allDrinksPricesRatings[0];
    } else if (allDrinksPricesRatings.length > 1) {
      persistedLocation.computedDrinkPrice = roundToClosestEnum(mean(allDrinksPricesRatings), [
        DrinkPrice.ZERO_TO_EIGHT, DrinkPrice.EIGHT_TO_FIFTEEN, DrinkPrice.OVER_FIFTEEN,
      ]);
    }
  }

  return persistedLocation;
}

export class FirebaseApi implements BackendApi {

  constructor(private uidProvider: () => string | undefined) {}

  createLocation(createRequest: CreateLocationRequest): Promise<Location> {
    const uid = this.uidProvider();
    if (uid === undefined) {
      return Promise.reject("User is not signed in.");
    }

    const newLocationRef = firebase.database().ref().child("locations").push();
    const newLocationId = newLocationRef.key;

    const persistedLocation: PersistedLocation = {
      id: newLocationId,
      name: createRequest.name,
      address: createRequest.address,
      googlePlaceId: createRequest.googlePlaceId,
      latitude: createRequest.latitude,
      longitude: createRequest.longitude,
      tags: createRequest.tags,
      reviews: {},
    };
    if (createRequest.review) {
      persistedLocation.reviews[uid] = createRequest.review;
    }

    addLocationToTags(createRequest.tags, newLocationId);

    const newLocation = firebaseifyLocation(persistedLocation);
    return Promise.resolve(newLocationRef.set(newLocation))
      .then(() => appifyLocation(newLocation));
  }

  async updateLocation(
    locationId: string, updateRequest: Partial<CreateLocationRequest>): Promise<Location> {
    const uid = this.uidProvider();
    if (uid === undefined) {
      return Promise.reject("User is not signed in.");
    }

    const oldLocation = await this.getLocation(locationId);
    const location = { ...oldLocation };
    delete location.computedRating;
    delete location.computedFoodPrice;
    delete location.computedDrinkPrice;

    if (updateRequest.name) {
      location.name = updateRequest.name;
    }
    if (updateRequest.address) {
      location.address = updateRequest.address;
    }
    if (updateRequest.googlePlaceId) {
      location.googlePlaceId = updateRequest.googlePlaceId;
    }
    if (updateRequest.latitude) {
      location.latitude = updateRequest.latitude;
    }
    if (updateRequest.longitude) {
      location.longitude = updateRequest.longitude;
    }
    if (updateRequest.tags) {
      removeLocationFromTags(oldLocation.tags, locationId);
      addLocationToTags(updateRequest.tags, locationId);
      location.tags = updateRequest.tags;
    }
    if (updateRequest.review) {
      location.reviews[uid] = updateRequest.review;
    }
    const newLocation = firebaseifyLocation(location);

    return Promise.resolve(firebase.database().ref(getLocationKey(locationId)).set(newLocation))
      .then(() => appifyLocation(newLocation));
  }

  deleteLocation(locationId: string): Promise<void> {
    return Promise.resolve(firebase.database().ref(getLocationKey(locationId)).remove());
  }

  setReview(locationId: string, review: LocationReview): Promise<Location> {
    const uid = this.uidProvider();
    if (uid === undefined) {
      return Promise.reject("User is not signed in.");
    }

    return Promise.resolve(firebase.database().ref(`${getLocationKey(locationId)}/reviews/${uid}`).set(review))
      .then(() => this.getLocation(locationId));
  }

  deleteReview(locationId: string): Promise<Location> {
    const uid = this.uidProvider();
    if (uid === undefined) {
      return Promise.reject("User is not signed in.");
    }

    return Promise.resolve(firebase.database().ref(`${getLocationKey(locationId)}/reviews/${uid}`).remove())
      .then(() => this.getLocation(locationId));
  }

  getLocation(locationId: string): Promise<Location> {
    return Promise.resolve(firebase.database().ref(getLocationKey(locationId)).once("value"))
      .then((snapshot) => appifyLocation(snapshot.val()));
  }

  getAllLocations(): Promise<{ [locationId: string]: Location }> {
    return Promise.resolve(firebase.database().ref("/locations/").once("value"))
      .then((snapshot) => mapValues(snapshot.val(), appifyLocation));
  }

  getAllTags(): Promise<string[]> {
    return Promise.resolve(firebase.database().ref("/tags/").once("value"))
      .then((snapshot) => {
        const tagsObject = snapshot.val();
        return tagsObject ? keys(tagsObject) : [];
      });
  }

  isAdmin(): Promise<boolean> {
    const uid = this.uidProvider();
    if (uid === undefined) {
      return Promise.reject("User is not signed in.");
    }

    return Promise.resolve(firebase.database().ref(`/users/${uid}`).once("value"))
      .then((snapshot) => snapshot.val() as UserRoles)
      .then((roles) => roles[ADMIN_AUTH_ROLE] === true);
  }

  getAuthors(): Promise<{ [uid: string]: UserRecord }> {
    // TODO: Not supported, remove.
    return Promise.resolve({});
  }

  getMapPresets(): Promise<PositionWithMetadata[]> {
    return Promise.resolve(firebase.database().ref("/map-presets").once("value"))
      .then((snapshot) => values(snapshot.val()));
  }
}

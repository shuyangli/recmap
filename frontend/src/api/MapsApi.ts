import * as GoogleMapsLoader from 'google-maps';
import { googleMapsApiKey } from '../config';

GoogleMapsLoader.KEY = googleMapsApiKey;
GoogleMapsLoader.LIBRARIES = ['places'];

export const mapsDefaults = {
  longitude: -122.42740250000001,
  latitude: 37.77674160000001,
  zoom: 15
};

export function initialize(): Promise<any> {
  return new Promise(resolve => {
    GoogleMapsLoader.load(resolve);
  });
}

export function getCurrentLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Browser doesn't support geolocation");
    }
  });
}

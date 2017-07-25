import * as GoogleMapsLoader from 'google-maps';
import { googleMapsApiKey } from '../config';

GoogleMapsLoader.KEY = googleMapsApiKey;
GoogleMapsLoader.LIBRARIES = ['places'];

export const initialize: () => Promise<any> = () => Promise.resolve(GoogleMapsLoader.load());

export function getCurrentLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Browser doesn't support geolocation");
    }
  });
}

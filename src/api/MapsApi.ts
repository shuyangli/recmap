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

export function initializeMapElement(wrapper: HTMLDivElement) {
  const google = (window as any).google;
  return new google.maps.Map(wrapper, {
    center: {
      lat: mapsDefaults.latitude,
      lng: mapsDefaults.longitude
    },
    zoom: mapsDefaults.zoom,
    mapTypeControl: false,
    streetViewControl: false
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

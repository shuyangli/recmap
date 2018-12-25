import * as GoogleMapsLoader from "google-maps";
import { memoize } from "lodash-es";

const mapsDefaults = {
  longitude: -122.42740250000001,
  latitude: 37.77674160000001,
  zoom: 15,
};

export interface MapsApi {
  initialize(googleMapsApiKey: string): Promise<any>;
  initializeMapElement(wrapper: HTMLDivElement): google.maps.Map;
  getCurrentLocation(): Promise<Position>;
  getDistanceBetween(latitude1: number, longitude1: number, latitude2: number, longitude2: number): number;
}

function initialize(googleMapsApiKey: string): Promise<any> {
  (GoogleMapsLoader as any).KEY = googleMapsApiKey;
  (GoogleMapsLoader as any).LIBRARIES = ["places", "geometry"];

  return new Promise((resolve) => {
    GoogleMapsLoader.load(resolve);
  });
}

function initializeMapElement(wrapper: HTMLDivElement) {
  const mapElement = new google.maps.Map(wrapper, {
    center: {
      lat: mapsDefaults.latitude,
      lng: mapsDefaults.longitude,
    },
    zoom: mapsDefaults.zoom,
    mapTypeControl: false,
    streetViewControl: false,
  });
  getCurrentLocation().then((position) => {
    mapElement.setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  });
  return mapElement;
}

const getCurrentLocation = memoize((): Promise<Position> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Browser doesn\"t support geolocation");
    }
  });
});

function getDistanceBetween(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(latitude1, longitude1),
    new google.maps.LatLng(latitude2, longitude2),
  );
}

export const mapsApi: MapsApi = {
  initialize,
  initializeMapElement,
  getCurrentLocation,
  getDistanceBetween,
};

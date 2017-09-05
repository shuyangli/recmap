import * as GoogleMapsLoader from "google-maps";
import {} from "@types/googlemaps"; // maps type hack
import { googleMapsApiKey } from "../config";

GoogleMapsLoader.KEY = googleMapsApiKey;
GoogleMapsLoader.LIBRARIES = ["places"];

export const mapsDefaults = {
  longitude: -122.42740250000001,
  latitude: 37.77674160000001,
  zoom: 15,
};

export function initialize(): Promise<any> {
  return new Promise((resolve) => {
    GoogleMapsLoader.load(resolve);
  });
}

export function initializeMapElement(wrapper: HTMLDivElement) {
  return new google.maps.Map(wrapper, {
    center: {
      lat: mapsDefaults.latitude,
      lng: mapsDefaults.longitude,
    },
    zoom: mapsDefaults.zoom,
    mapTypeControl: false,
    streetViewControl: false,
  });
}

export function getCurrentLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Browser doesn\"t support geolocation");
    }
  });
}

export function getDistanceBetween(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(latitude1, longitude1),
    new google.maps.LatLng(latitude2, longitude2),
  );
}

import * as GoogleMapsLoader from "google-maps";
import { memoize } from "lodash-es";
import { MapsApi } from "./MapsApi";

const mapsDefaults = {
  longitude: -122.42740250000001,
  latitude: 37.77674160000001,
  zoom: 15,
};

export class GoogleMapsApi implements MapsApi {
  private mapElement: google.maps.Map | undefined;
  private placesService: google.maps.places.PlacesService | undefined;

  constructor(googleMapsApiKey: string) {
    (GoogleMapsLoader as any).KEY = googleMapsApiKey;
    (GoogleMapsLoader as any).LIBRARIES = ["places", "geometry"];
    this.mapElement = undefined;
    this.placesService = undefined;
  }

  initialize(): Promise<any> {
    return new Promise((resolve) => GoogleMapsLoader.load(resolve));
  }

  initializeMapElement(wrapper: HTMLDivElement) {
    const mapElement = new google.maps.Map(wrapper, {
      center: {
        lat: mapsDefaults.latitude,
        lng: mapsDefaults.longitude,
      },
      zoom: mapsDefaults.zoom,
      mapTypeControl: false,
      streetViewControl: false,
    });
    this.mapElement = mapElement;
    this.placesService = new google.maps.places.PlacesService(this.mapElement);
    this.getCurrentLocation().then((position) => {
      this.mapElement.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    return mapElement;
  }

  getCurrentLocation = memoize((): Promise<Position> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject("Browser doesn\"t support geolocation");
      }
    });
  });

  getDistanceBetween(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(latitude1, longitude1),
      new google.maps.LatLng(latitude2, longitude2),
    );
  }

  getGoogleMapsUrl(placeId: string): Promise<string> {
    if (this.placesService) {
      return new Promise((resolve, reject) => {
        this.placesService.getDetails({ placeId }, (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(result.url);
          } else {
            reject({ result, status });
          }
        });
      });
    } else {
      return Promise.reject("Google Maps is not initialized");
    }
  }
}

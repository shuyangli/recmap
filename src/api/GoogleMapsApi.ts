import * as GoogleMapsLoader from "google-maps";
import { MapsApi, getCurrentPosition } from "./MapsApi";

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
      fullscreenControl: false,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
      },
    });
    this.mapElement = mapElement;
    this.placesService = new google.maps.places.PlacesService(this.mapElement);
    getCurrentPosition().then((position) => {
      this.setMapCenter(position.coords.latitude, position.coords.longitude);
    });
    return mapElement;
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

  setMapCenter(latitude: number, longitude: number) {
    this.mapElement.panTo({
      lat: latitude,
      lng: longitude,
    });
  }

  getMapElement() {
    return this.mapElement;
  }
}

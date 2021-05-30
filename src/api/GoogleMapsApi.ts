import { Loader } from "google-maps";
import { MapsApi } from "./MapsApi";
import { NEW_YORK_CITY_POSITION } from "../store/locations/types";

const mapsDefaults = {
  longitude: NEW_YORK_CITY_POSITION.position.longitude,
  latitude: NEW_YORK_CITY_POSITION.position.latitude,
  zoom: 15,
};

export class GoogleMapsApi implements MapsApi {
  private mapElement: google.maps.Map | undefined;
  private placesService: google.maps.places.PlacesService | undefined;
  private mapsLoader: any /* Loader */;

  constructor(googleMapsApiKey: string) {
    this.mapsLoader = new Loader(googleMapsApiKey, {
      libraries: ["places", "geometry"],
    });
    this.mapElement = undefined;
    this.placesService = undefined;
  }

  initialize(): Promise<any> {
    return this.mapsLoader.load();
  }

  initializeMapElement(wrapper: HTMLDivElement) {
    const mapElement = new google.maps.Map(wrapper, {
      center: {
        lat: mapsDefaults.latitude,
        lng: mapsDefaults.longitude,
      },
      zoom: mapsDefaults.zoom,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
        style: google.maps.ZoomControlStyle.SMALL,
      },
    });
    this.mapElement = mapElement;
    this.placesService = new google.maps.places.PlacesService(this.mapElement);
    return mapElement;
  }

  getGoogleMapsUrl(placeId: string): Promise<string> {
    if (this.placesService) {
      return new Promise((resolve, reject) => {
        this.placesService.getDetails({
          placeId,
          fields: ["url"],
        }, (result, status) => {
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

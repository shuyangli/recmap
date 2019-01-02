import { memoize } from "lodash-es";

export interface MapsApi {
  initialize(): Promise<any>;
  initializeMapElement(wrapper: HTMLDivElement): google.maps.Map;
  getGoogleMapsUrl(placeId: string): Promise<string>;
  setMapCenter(latitude: number, longitude: number): void;
  getMapElement(): google.maps.Map;
}

export function getDistanceBetween(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(latitude1, longitude1),
    new google.maps.LatLng(latitude2, longitude2),
  );
}

export const getCurrentPosition = memoize((): Promise<Position> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Browser doesn\"t support geolocation");
    }
  });
});

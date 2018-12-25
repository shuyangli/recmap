export interface MapsApi {
  initialize(): Promise<any>;
  initializeMapElement(wrapper: HTMLDivElement): google.maps.Map;
  getCurrentLocation(): Promise<Position>;
  getDistanceBetween(latitude1: number, longitude1: number, latitude2: number, longitude2: number): number;
  getGoogleMapsUrl(placeId: string): Promise<string>;
}

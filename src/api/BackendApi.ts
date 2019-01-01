import { Location } from "./interfaces";

export interface BackendApi {
  createLocation(location: Location): Promise<Location>;
  updateLocation(locationId: string, location: Location): Promise<Location>;
  deleteLocation(locationId: string): Promise<void>;
  getLocation(locationId: string): Promise<Location>;
  getAllLocations(): Promise<{ [locationId: string]: Location }>;
  getAllTags(): Promise<string[]>;
  isAdmin(): Promise<boolean>;
}

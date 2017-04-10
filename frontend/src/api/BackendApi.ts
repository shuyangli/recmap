import {
  Location
} from './interfaces';

export interface BackendApi {
  createLocation(location: Location): Promise<Location>;
  updateLocation(location: Location): Promise<Location>;
  getLocation(id: string): Promise<Location>;
  getAllLocations(): Promise<{ [id: string]: Location }>;
}

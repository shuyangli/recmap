import { Location, CreateLocationRequest, UserRecord } from "./interfaces";

export interface BackendApi {
  createLocation(request: CreateLocationRequest): Promise<Location>;
  updateLocation(locationId: string, request: Partial<CreateLocationRequest>): Promise<Location>;
  deleteLocation(locationId: string): Promise<void>;
  getLocation(locationId: string): Promise<Location>;
  getAllLocations(): Promise<{ [locationId: string]: Location }>;
  getAllTags(): Promise<string[]>;
  isAdmin(): Promise<boolean>;
  getUserRecord(userId: string): Promise<UserRecord>;
}

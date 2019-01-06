import { Location, CreateLocationRequest, UserRecord, LocationReview, PositionWithMetadata } from "./interfaces";

export interface BackendApi {
  createLocation(request: CreateLocationRequest): Promise<Location>;
  updateLocation(locationId: string, request: Partial<CreateLocationRequest>): Promise<Location>;
  deleteLocation(locationId: string): Promise<void>;
  setReview(locationId: string, review: LocationReview): Promise<Location>;
  deleteReview(locationId: string): Promise<Location>;
  getLocation(locationId: string): Promise<Location>;
  getAllLocations(): Promise<{ [locationId: string]: Location }>;
  getAllTags(): Promise<string[]>;

  isAdmin(): Promise<boolean>;
  getAuthors(): Promise<{ [uid: string]: UserRecord }>;

  getMapPresets(): Promise<PositionWithMetadata[]>;
}

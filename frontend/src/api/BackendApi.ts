import { Location } from './interfaces';
import { FirebaseApi } from './FirebaseApi';
import { firebaseConfig } from '../config';

export interface BackendApi {
  createOrUpdateLocation(location: Location, oldLocation?: Location): Promise<Location>;
  getLocation(id: string): Promise<Location>;
  getAllLocations(): Promise<{ [id: string]: Location }>;
  getAllTags(): Promise<string[]>;
}

export const backendApi: BackendApi = new FirebaseApi(firebaseConfig);

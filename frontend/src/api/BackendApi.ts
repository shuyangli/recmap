import { Location } from './interfaces';
import { FirebaseApi } from './FirebaseApi';
import { firebaseConfig } from '../config';

export interface BackendApi {
  createLocation(location: Location): Promise<Location>;
  updateLocation(location: Location): Promise<Location>;
  getLocation(id: string): Promise<Location>;
  getAllLocations(): Promise<{ [id: string]: Location }>;
}

export const backendApi: BackendApi = new FirebaseApi(firebaseConfig);
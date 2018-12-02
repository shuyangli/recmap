export interface Location {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  notes: string;
  tags: string[];
  rating?: number; /* -1 - 2 */
  googlePlaceId?: string;
}

export interface Review {
  id: string;
  locationId: string;
  rating: number;
  notes: string;
}

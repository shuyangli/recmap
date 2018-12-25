export interface Location {
  id?: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  notes: {
    notes?: string;
    order?: string;
    avoid?: string;
  };
  tags: string[];
  rating?: number; /* -1, 0, 1, 2 */
  googlePlaceId?: string;
}

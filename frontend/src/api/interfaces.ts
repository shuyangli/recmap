export interface Location {
  id?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  notes: string;
};

export enum Rating {
  BAD = -1,
  NEUTRAL = 0,
  GOOD = 1,
  EXCELLENT = 2
};

export interface Review {
  id: string;
  locationId: string;
  rating: Rating;
  notes: string;
};

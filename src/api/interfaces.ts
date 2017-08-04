export interface Location {
  id?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  notes: string;
  tags: string[];
  rating?: Rating;
};

export enum Rating {
  BAD = 0,
  NEUTRAL = 1,
  GOOD = 2,
  EXCELLENT = 3
};

export interface Review {
  id: string;
  locationId: string;
  rating: Rating;
  notes: string;
};

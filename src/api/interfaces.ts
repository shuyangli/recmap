export enum Rating {
  BAD = -1,
  NEUTRAL = 0,
  GOOD = 1,
  GREAT = 2,
}

export enum PriceRange {
  ZERO_TO_TEN = 10,
  TEN_TO_TWENTY_FIVE = 25,
  TWENTY_FIVE_TO_FIFTY = 50,
  OVER_FIFTY = 51,
}

export interface LocationReview {
  notes?: string;
  order?: string;
  avoid?: string;
}

export interface Location {
  id?: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  notes?: LocationReview;
  tags: string[];
  rating?: Rating;
  priceRange?: PriceRange;
  googlePlaceId?: string;
}

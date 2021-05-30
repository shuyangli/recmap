export enum Rating {
  BAD = -1,
  NEUTRAL = 0,
  GOOD = 1,
  GREAT = 2,
}

export enum FoodPrice {
  ZERO_TO_FIFTEEN = 15,
  FIFTEEN_TO_THIRTY = 30,
  THIRTY_TO_SIXTY = 60,
  OVER_SIXTY = 61,
}

export enum DrinkPrice {
  ZERO_TO_EIGHT = 8,
  EIGHT_TO_FIFTEEN = 15,
  OVER_FIFTEEN = 16,
}

export interface LocationReview {
  rating: Rating;
  foodPrice?: FoodPrice;
  drinkPrice?: DrinkPrice;
  notes?: string;
  order?: string;
  avoid?: string;
}

export interface PersistedLocation {
  id: string;
  name: string;
  address?: string;
  googlePlaceId?: string;
  latitude: number;
  longitude: number;
  reviews: {
    [uid: string]: LocationReview;
  };
  tags: string[];
}

export interface Location extends PersistedLocation {
  computedFoodPrice?: FoodPrice;
  computedDrinkPrice?: DrinkPrice;
  computedRating?: Rating;
}

export interface CreateLocationRequest {
  name: string;
  address?: string;
  googlePlaceId?: string;
  latitude: number;
  longitude: number;
  tags: string[];
  review?: LocationReview;
}

export interface UserRoles {
  [role: string]: boolean;
}

export interface PositionWithMetadata {
  name: string;
  position: {
    latitude: number,
    longitude: number,
  };
}

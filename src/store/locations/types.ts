import { Location, FoodPrice, Rating, PositionWithMetadata } from "../../api/interfaces";

export interface FilterState {
  searchTerm: string;
  priceRange: {
    foodPrice: FoodPrice | undefined;
    includeLower: boolean;
  };
  rating: {
    rating: Rating | undefined;
    includeHigher: boolean;
  };
  tags: string[];
}

export const EMPTY_FILTER_STATE: FilterState = {
  searchTerm: "",
  priceRange: {
    foodPrice: undefined,
    includeLower: false,
  },
  rating: {
    rating: undefined,
    includeHigher: false,
  },
  tags: [],
};

export const NEW_YORK_CITY_POSITION: PositionWithMetadata = {
  name: "New York City",
  position: {
    latitude: 40.732923,
    longitude: -74.0055911,
  },
};

export interface LocationState {
  currentPosition: PositionWithMetadata;
  presetPositions: PositionWithMetadata[];
  locations: { [id: string]: Location };
  filter: FilterState;
}

export const EMPTY_LOCATION_STATE: LocationState = {
  currentPosition: NEW_YORK_CITY_POSITION, // for synchronous access in filtering
  presetPositions: [NEW_YORK_CITY_POSITION],
  locations: {},
  filter: EMPTY_FILTER_STATE,
};

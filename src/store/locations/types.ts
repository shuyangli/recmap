import { Location, FoodPrice, Rating } from "../../api/interfaces";

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

export interface PositionWithMetadata {
  name: string;
  position: {
    latitude: number,
    longitude: number,
  };
}

const SAN_FRANCISCO_POSITION: PositionWithMetadata = {
  name: "San Francisco Bay Area",
  position: {
    latitude: 37.7767416,
    longitude: -122.4274025,
  },
};

export const NEW_YORK_CITY_POSITION: PositionWithMetadata = {
  name: "New York City",
  position: {
    latitude: 40.732923,
    longitude: -74.0055911,
  },
};

export const PresetPositions = [
  NEW_YORK_CITY_POSITION,
  SAN_FRANCISCO_POSITION,
];

export interface LocationState {
  currentPosition: PositionWithMetadata;
  locations: { [id: string]: Location };
  filter: FilterState;
}

export const EMPTY_LOCATION_STATE: LocationState = {
  currentPosition: NEW_YORK_CITY_POSITION, // for synchronous access in filtering
  locations: {},
  filter: EMPTY_FILTER_STATE,
};

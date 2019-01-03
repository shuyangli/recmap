import { Location, PriceRange, Rating } from "../../api/interfaces";

export interface FilterState {
  searchTerm: string;
  priceRange: {
    range: PriceRange | undefined;
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
    range: undefined,
    includeLower: false,
  },
  rating: {
    rating: undefined,
    includeHigher: false,
  },
  tags: [],
};

export interface LocationState {
  currentPosition: Position | undefined;
  locations: { [id: string]: Location };
  filter: FilterState;
}

export const EMPTY_LOCATION_STATE: LocationState = {
  currentPosition: undefined, // for synchronous access in filtering
  locations: {},
  filter: EMPTY_FILTER_STATE,
};

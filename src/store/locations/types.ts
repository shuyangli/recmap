import { Location } from "@src/api/interfaces";

export interface FilterState {
  searchTerm: string;
  tags: string[];
}

export const EMPTY_FILTER_STATE: FilterState = {
  searchTerm: "",
  tags: [],
};

export interface LocationState {
  currentLocation: {
    latitude: number;
    longitude: number;
  } | undefined;
  locations: { [id: string]: Location };
  filter: FilterState;
}

export const EMPTY_LOCATION_STATE: LocationState = {
  currentLocation: undefined,
  locations: {},
  filter: EMPTY_FILTER_STATE,
};

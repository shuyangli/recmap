import { Location } from "../../api/interfaces";

export interface FilterState {
  searchTerm: string;
}

export const EMPTY_FILTER_STATE: FilterState = {
  searchTerm: "",
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

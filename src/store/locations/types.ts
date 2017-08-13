import { Location } from '@src/api/interfaces';

export interface FilterState {
  searchTerm: string;
  tags: string[];
}

export const EMPTY_FILTER_STATE: FilterState = {
  searchTerm: '',
  tags: []
};

export interface LocationState {
  locations: { [id: string]: Location };
  filter: FilterState;
}

export const EMPTY_LOCATION_STATE: LocationState = {
  locations: {},
  filter: EMPTY_FILTER_STATE
};

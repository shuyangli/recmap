import * as _ from 'lodash';
import * as fuzzy from 'fuzzy';
import { createSelector } from 'reselect';
import { LocationState, FilterState } from './types';
import { RootState } from '../store';

const getAllLocations = (state: RootState) => state.location.locations;
const getFilter = (state: RootState) => state.location.filter;

export const getFilteredLocations = createSelector(
  [getAllLocations, getFilter],
  (locations, filter) => {
    if (filter.searchTerm) {
      const filtered = fuzzy.filter(
        filter.searchTerm,
        _.values(locations),
        { extract: (location) => location.name }
      );
      // When a search term is present, the results are sorted by relevance,
      // and fuzzy already sorts them for us.
      return filtered.map(result => result.original);
    } else {
      return _.values(locations);
    }
  }
);

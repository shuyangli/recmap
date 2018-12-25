import * as fuzzy from "fuzzy";
import { createSelector } from "reselect";

import { RootState } from "../../store/RootState";
import { values, isEmpty } from "lodash-es";

const getAllLocations = (state: RootState) => state.location.locations;
const getFilter = (state: RootState) => state.location.filter;

export const getFilteredLocations = createSelector(
  [getAllLocations, getFilter],
  (locations, filter) => {

    let remainingLocations = values(locations);

    if (!isEmpty(filter.searchTerm)) {
      const filtered = fuzzy.filter(
        filter.searchTerm,
        values(locations),
        { extract: (location) => location.name },
      );
      // When a search term is present, the results are sorted by relevance,
      // and fuzzy already sorts them for us.
      remainingLocations = filtered.map((result) => result.original);
    }

    return remainingLocations;
  },
);

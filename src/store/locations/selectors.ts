import * as fuzzy from "fuzzy";
import * as _ from "lodash";
import { createSelector } from "reselect";

import { RootState } from "@src/store/store";

const getAllLocations = (state: RootState) => state.location.locations;
const getFilter = (state: RootState) => state.location.filter;

export const getFilteredLocations = createSelector(
  [getAllLocations, getFilter],
  (locations, filter) => {

    let remainingLocations = _.values(locations);

    if (!_.isEmpty(filter.searchTerm)) {
      const filtered = fuzzy.filter(
        filter.searchTerm,
        _.values(locations),
        { extract: (location) => location.name },
      );
      // When a search term is present, the results are sorted by relevance,
      // and fuzzy already sorts them for us.
      remainingLocations = filtered.map((result) => result.original);
    }

    if (!_.isEmpty(filter.tags)) {
      remainingLocations = remainingLocations.filter((location) =>
        filter.tags.some((tag) => _.includes(location.tags, tag)));
    }

    return remainingLocations;
  },
);

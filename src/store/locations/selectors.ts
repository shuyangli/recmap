import * as fuzzy from "fuzzy";
import { createSelector } from "reselect";

import { RootState } from "../../store/RootState";
import { values, isEmpty, sortBy } from "lodash-es";
import { Location } from "../../api/interfaces";
import { getDistanceBetween } from "../../api/MapsApi";

const getAllLocations = (state: RootState) => state.location.locations;
const getFilter = (state: RootState) => state.location.filter;
const getCurrentPosition = (state: RootState) => state.location.currentPosition;

export const getFilteredLocations = createSelector(
  [getAllLocations, getFilter, getCurrentPosition],
  (locations, filter, currentPosition) => {
    let remainingLocations = values(locations);

    if (currentPosition != null) {
      remainingLocations = sortBy<Location>(remainingLocations, (location) => {
        return getDistanceBetween(
          location.latitude,
          location.longitude,
          currentPosition.coords.latitude,
          currentPosition.coords.longitude,
        );
      });
    }

    if (!isEmpty(filter.searchTerm)) {
      const filtered = fuzzy.filter(
        filter.searchTerm,
        remainingLocations,
        { extract: extractLocationString },
      );
      // When a search term is present, the results are sorted by relevance,
      // and fuzzy already sorts them for us.
      remainingLocations = filtered.map((result) => result.original);
    }

    return remainingLocations;
  },
);

function extractLocationString(location: Location): string {
  let extracted: string = location.name;
  if (location.notes) {
    if (location.notes.notes) {
      extracted = extracted + location.notes.notes;
    }
    if (location.notes.order) {
      extracted = extracted + location.notes.order;
    }
    if (location.notes.avoid) {
      extracted = extracted + location.notes.avoid;
    }
  }
  return extracted;
}

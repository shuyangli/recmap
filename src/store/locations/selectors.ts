import * as Fuse from "fuse.js";
import { createSelector } from "reselect";

import { RootState } from "../../store/RootState";
import { values, isEmpty, sortBy } from "lodash-es";
import { Location } from "../../api/interfaces";
import { getDistanceBetween } from "../../api/MapsApi";

const getAllLocations = (state: RootState) => state.location.locations;
const getCurrentPosition = (state: RootState) => state.location.currentPosition;
const getFilter = (state: RootState) => state.location.filter;

const locationListSelector = createSelector(
  [getAllLocations, getCurrentPosition, getFilter],
  (locations, currentPosition, filter) => {
    let sortedLocations = values(locations);

    if (filter.priceRange.range != null) {
      sortedLocations = sortedLocations.filter((loc) => {
        return loc.priceRange != null && (
          loc.priceRange === filter.priceRange.range || (
            filter.priceRange.includeLower && loc.priceRange < filter.priceRange.range
          )
        );
      });
    }

    if (filter.rating.rating != null) {
      sortedLocations = sortedLocations.filter((loc) => {
        return loc.rating != null && (
          loc.rating === filter.rating.rating || (
            filter.rating.includeHigher && loc.rating > filter.rating.rating
          )
        );
      });
    }

    if (currentPosition != null) {
      sortedLocations = sortBy<Location>(sortedLocations, (location) => {
        return getDistanceBetween(
          location.latitude,
          location.longitude,
          currentPosition.coords.latitude,
          currentPosition.coords.longitude,
        );
      });
    }
    return sortedLocations;
  });

const fuseSelector = createSelector(
  locationListSelector,
  (locations) => {
    const fuseOptions: Fuse.FuseOptions<Location> = {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "tags", weight: 0.21 },
        { name: "notes.notes", weight: 0.03 },
        { name: "notes.order", weight: 0.04 },
        { name: "notes.avoid", weight: 0.02 },
      ] as any,
    };
    return new Fuse(locations, fuseOptions);
  },
);

export const getFilteredLocations = createSelector(
  [fuseSelector, getFilter, locationListSelector],
  (fuse, filter, allLocations) => {
    if (!isEmpty(filter.searchTerm)) {
      return fuse.search(filter.searchTerm);
    } else {
      return allLocations;
    }
  },
);

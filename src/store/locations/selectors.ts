import Fuse from "fuse.js";
import { createSelector } from "reselect";

import { RootState } from "../../store/RootState";
import { values, isEmpty, sortBy } from "lodash-es";
import { Location } from "../../api/interfaces";
import { getDistanceBetween } from "../../api/MapsApi";

const getAllLocations = (state: RootState) => state.location.locations;
export const currentPositionSelector = (state: RootState) => state.location.currentPosition;
export const presetPositionsSelector = (state: RootState) => state.location.presetPositions;
const getFilter = (state: RootState) => state.location.filter;

const locationListSelector = createSelector(
  [getAllLocations, currentPositionSelector, getFilter],
  (locations, currentPosition, filter) => {
    let sortedLocations = values(locations);

    if (filter.priceRange.foodPrice != null) {
      sortedLocations = sortedLocations.filter((loc) => {
        return loc.computedFoodPrice != null && (
          loc.computedFoodPrice === filter.priceRange.foodPrice || (
            filter.priceRange.includeLower && loc.computedFoodPrice < filter.priceRange.foodPrice
          )
        );
      });
    }

    if (filter.rating.rating != null) {
      sortedLocations = sortedLocations.filter((loc) => {
        return loc.computedRating != null && (
          loc.computedRating === filter.rating.rating || (
            filter.rating.includeHigher && loc.computedRating > filter.rating.rating
          )
        );
      });
    }

    if (currentPosition != null) {
      sortedLocations = sortBy<Location>(sortedLocations, (location) => {
        return getDistanceBetween(
          location.latitude,
          location.longitude,
          currentPosition.position.latitude,
          currentPosition.position.longitude,
        );
      });
    }
    return sortedLocations;
  });

const fuseSelector = createSelector(
  locationListSelector,
  (locations) => {
    const fuseOptions: Fuse.IFuseOptions<Location> = {
      keys: [
        { name: "name", weight: 0.7 },
        { name: "tags", weight: 0.21 },
        { name: "notes.notes", weight: 0.03 },
        { name: "notes.order", weight: 0.04 },
        { name: "notes.avoid", weight: 0.02 },
      ],
    };
    return new Fuse(locations, fuseOptions);
  },
);

export const getFilteredLocations = createSelector(
  [fuseSelector, getFilter, locationListSelector],
  (fuse, filter, allLocations) => {
    if (!isEmpty(filter.searchTerm)) {
      return fuse.search(filter.searchTerm).map((result) => result.item);
    } else {
      return allLocations;
    }
  },
);

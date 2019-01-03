import * as Fuse from "fuse.js";
import { createSelector } from "reselect";

import { RootState } from "../../store/RootState";
import { values, isEmpty, sortBy } from "lodash-es";
import { Location } from "../../api/interfaces";
import { getDistanceBetween } from "../../api/MapsApi";

const getAllLocations = (state: RootState) => state.location.locations;
const getCurrentPosition = (state: RootState) => state.location.currentPosition;
const locationListSelector = createSelector(
  getAllLocations,
  getCurrentPosition,
  (locations, currentPosition) => {
    let sortedLocations = values(locations);
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

const getFilter = (state: RootState) => state.location.filter;

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
      return fuse.search(filter.searchTerm)
    } else {
      return allLocations;
    }
  },
);

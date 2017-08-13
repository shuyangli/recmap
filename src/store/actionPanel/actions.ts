export const TOGGLE_DETAIL_PANEL = "TOGGLE_DETAIL_PANEL";
export const TOGGLE_EDIT_PANEL = "TOGGLE_EDIT_PANEL";
export const CLOSE_PANEL = "CLOSE_PANEL";

export const toggleDetailsPanel = (locationId: string) => ({
  type: TOGGLE_DETAIL_PANEL,
  payload: { locationId },
});

export const toggleEditPanel = (locationId?: string) => ({
  type: TOGGLE_EDIT_PANEL,
  payload: { locationId },
});

export const closePanel = () => ({
  type: CLOSE_PANEL,
});

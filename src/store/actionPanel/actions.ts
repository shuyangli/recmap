import { TypedAction } from "redoodle";

export const ToggleDetailPanel = TypedAction.define("ToggleDetailPanel")<{
  locationId: string;
}>();
export const ToggleEditPanel = TypedAction.define("ToggleEditPanel")<{
  locationId?: string;
}>();
export const OpenEditReviewPanel = TypedAction.define("OpenEditReviewPanel")<{
  locationId: string;
}>();
export const ClosePanel = TypedAction.defineWithoutPayload("ClosePanel")();

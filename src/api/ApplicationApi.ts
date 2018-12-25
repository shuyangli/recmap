import { BackendApi } from "./BackendApi";
import { MapsApi } from "./MapsApi";

export interface ApplicationApi {
  backendApi: BackendApi;
  mapsApi: MapsApi;
}

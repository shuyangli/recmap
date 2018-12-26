import { ServerConfig } from "../config";
import { BackendApi } from "./BackendApi";
import { Location } from "./interfaces";

export class ExpressApi implements BackendApi {
  private host: string;

  constructor(config: ServerConfig) {
    this.host = config.host;
  }

  private getPath(path: string): string {
    return `${this.host}${path}`;
  }

  async createLocation(location: Location): Promise<Location> {
    const locationResponse = await fetch(this.getPath("/firebase/locations"), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    }).then((response) => response.json());

    return locationResponse;
  }

  async updateLocation(locationId: string, location: Location): Promise<Location> {
    const locationResponse = await fetch(this.getPath(`/firebase/locations/${locationId}`), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    }).then((response) => response.json());

    return locationResponse;
  }

  async deleteLocation(locationId: string) {
    await fetch(this.getPath(`/firebase/locations/${locationId}`), {
      method: "delete",
    });
    return;
  }

  async getLocation(locationId: string) {
    const locationResponse = await fetch(this.getPath(`/firebase/locations/${locationId}`))
      .then((response) => response.json());
    return locationResponse;
  }

  async getAllLocations() {
    const locationResponse = await fetch(this.getPath("/firebase/locations"))
      .then((response) => response.json());
    return locationResponse;
  }

  async getAllTags() {
    const tagsResponse = await fetch(this.getPath("/firebase/tags"))
      .then((response) => response.json());
    return tagsResponse;
  }
}

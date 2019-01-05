import { ServerConfig } from "../config";
import { BackendApi } from "./BackendApi";
import { Location, CreateLocationRequest, UserRecord } from "./interfaces";

export class ExpressApi implements BackendApi {
  private host: string;

  constructor(
    config: ServerConfig,
    private authTokenProvider: () => Promise<string | undefined>,
    private uidProvider: () => string | undefined,
  ) {
    this.host = config.host;
  }

  private getPath(path: string): string {
    return `${this.host}${path}`;
  }

  async createLocation(request: CreateLocationRequest): Promise<Location> {
    const authToken = await this.authTokenProvider();
    const locationResponse = await fetch(this.getPath("/locations"), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(request),
    }).then((response) => response.json());

    return locationResponse;
  }

  async updateLocation(locationId: string, request: CreateLocationRequest): Promise<Location> {
    const authToken = await this.authTokenProvider();
    const locationResponse = await fetch(this.getPath(`/locations/${locationId}`), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(request),
    }).then((response) => response.json());

    return locationResponse;
  }

  async deleteLocation(locationId: string) {
    const authToken = await this.authTokenProvider();
    await fetch(this.getPath(`/locations/${locationId}`), {
      method: "delete",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    return;
  }

  async getLocation(locationId: string) {
    const authToken = await this.authTokenProvider();
    const locationResponse = await fetch(this.getPath(`/locations/${locationId}`), {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json());
    return locationResponse;
  }

  async getAllLocations() {
    const authToken = await this.authTokenProvider();
    const locationResponse = await fetch(this.getPath("/locations"), {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json());
    return locationResponse;
  }

  async getAllTags() {
    const authToken = await this.authTokenProvider();
    const tagsResponse = await fetch(this.getPath("/tags"), {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json());
    return tagsResponse;
  }

  async isAdmin() {
    const authToken = await this.authTokenProvider();
    const uid = this.uidProvider();
    const adminResponse = await fetch(this.getPath(`/users/${uid}/is-admin`), {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json());
    return adminResponse;
  }

  async getUserRecord(userId: string): Promise<UserRecord> {
    const authToken = await this.authTokenProvider();
    const uid = this.uidProvider();
    const adminResponse = await fetch(this.getPath(`/users/${uid}`), {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    }).then((response) => response.json());
    return adminResponse;
  }
}
